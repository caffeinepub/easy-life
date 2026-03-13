import AccessControl "authorization/access-control";
import MixinAuth "authorization/MixinAuthorization";
import BlobMixin "blob-storage/Mixin";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

actor {
  // ── Authorization state ──────────────────────────────────────────────────
  let accessControlState : AccessControl.AccessControlState = AccessControl.initState();
  include MixinAuth(accessControlState);

  // ── Blob-storage mixin ───────────────────────────────────────────────────
  include BlobMixin();

  // ── Data types ───────────────────────────────────────────────────────────
  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    priceInCents : Nat;
    category : Text;
    imageUrl : Text;
    stock : Nat;
  };

  public type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  public type OrderStatus = {
    #pending;
    #paid;
    #shipped;
    #delivered;
  };

  public type Order = {
    id : Nat;
    userId : Principal;
    items : [CartItem];
    totalInCents : Nat;
    status : OrderStatus;
    createdAt : Int;
  };

  // ── State ────────────────────────────────────────────────────────────────
  var nextProductId : Nat = 8;
  var nextOrderId : Nat = 1;

  let products : Map.Map<Nat, Product> = Map.empty<Nat, Product>();
  let carts : Map.Map<Principal, List.List<CartItem>> = Map.empty<Principal, List.List<CartItem>>();
  let orders : Map.Map<Nat, Order> = Map.empty<Nat, Order>();

  var stripeSecretKey : Text = "";

  // ── Stripe transform ─────────────────────────────────────────────────────
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // ── Seed products ────────────────────────────────────────────────────────
  products.add(1, { id = 1; name = "Wireless Headphones"; description = "Premium noise-cancelling over-ear headphones"; priceInCents = 7999; category = "Electronics"; imageUrl = ""; stock = 50 });
  products.add(2, { id = 2; name = "Smart Watch"; description = "Feature-rich smartwatch with health tracking"; priceInCents = 14999; category = "Electronics"; imageUrl = ""; stock = 30 });
  products.add(3, { id = 3; name = "Bluetooth Speaker"; description = "Portable waterproof speaker with 360-degree sound"; priceInCents = 4999; category = "Electronics"; imageUrl = ""; stock = 75 });
  products.add(4, { id = 4; name = "Classic T-Shirt"; description = "Soft premium cotton t-shirt, available in multiple colors"; priceInCents = 2499; category = "Clothing"; imageUrl = ""; stock = 200 });
  products.add(5, { id = 5; name = "Denim Jacket"; description = "Timeless denim jacket with a relaxed fit"; priceInCents = 8999; category = "Clothing"; imageUrl = ""; stock = 40 });
  products.add(6, { id = 6; name = "Scented Candle"; description = "Hand-poured soy wax candle with calming fragrance"; priceInCents = 1899; category = "Home & Garden"; imageUrl = ""; stock = 120 });
  products.add(7, { id = 7; name = "Coffee Maker"; description = "Programmable drip coffee maker with thermal carafe"; priceInCents = 6499; category = "Home & Garden"; imageUrl = ""; stock = 25 });

  // ── Product queries ──────────────────────────────────────────────────────
  public query func getProducts() : async [Product] {
    products.values().toArray();
  };

  public query func getProduct(id : Nat) : async ?Product {
    products.get(id);
  };

  // ── Product mutations (admin only) ────────────────────────────────────────
  public shared ({ caller }) func addProduct(
    name : Text,
    description : Text,
    priceInCents : Nat,
    category : Text,
    imageUrl : Text,
    stock : Nat,
  ) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admins only");
    };
    let id = nextProductId;
    nextProductId += 1;
    products.add(id, { id; name; description; priceInCents; category; imageUrl; stock });
    id;
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admins only");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admins only");
    };
    products.remove(id);
  };

  // ── Cart operations ───────────────────────────────────────────────────────
  public shared ({ caller }) func addToCart(productId : Nat, quantity : Nat) : async () {
    let existing = switch (carts.get(caller)) {
      case (?list) { list };
      case (null) { List.empty<CartItem>() };
    };
    var found = false;
    let updated = List.empty<CartItem>();
    for (item in existing.values()) {
      if (item.productId == productId) {
        updated.add({ productId; quantity = item.quantity + quantity });
        found := true;
      } else {
        updated.add(item);
      };
    };
    if (not found) {
      updated.add({ productId; quantity });
    };
    carts.add(caller, updated);
  };

  public shared ({ caller }) func removeFromCart(productId : Nat) : async () {
    switch (carts.get(caller)) {
      case (null) {};
      case (?list) {
        let updated = List.empty<CartItem>();
        for (item in list.values()) {
          if (item.productId != productId) { updated.add(item) };
        };
        carts.add(caller, updated);
      };
    };
  };

  public shared ({ caller }) func updateCartQuantity(productId : Nat, quantity : Nat) : async () {
    switch (carts.get(caller)) {
      case (null) {};
      case (?list) {
        let updated = List.empty<CartItem>();
        for (item in list.values()) {
          if (item.productId == productId) {
            if (quantity > 0) { updated.add({ productId; quantity }) };
          } else {
            updated.add(item);
          };
        };
        carts.add(caller, updated);
      };
    };
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    switch (carts.get(caller)) {
      case (?list) { list.toArray() };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    carts.add(caller, List.empty<CartItem>());
  };

  // ── Orders ────────────────────────────────────────────────────────────────
  public shared ({ caller }) func placeOrder() : async Nat {
    let cartItems = switch (carts.get(caller)) {
      case (?list) { list.toArray() };
      case (null) { [] };
    };
    if (cartItems.size() == 0) {
      Runtime.trap("Cart is empty");
    };
    var total : Nat = 0;
    for (item in cartItems.vals()) {
      switch (products.get(item.productId)) {
        case (?p) { total += p.priceInCents * item.quantity };
        case (null) {};
      };
    };
    let id = nextOrderId;
    nextOrderId += 1;
    orders.add(id, {
      id;
      userId = caller;
      items = cartItems;
      totalInCents = total;
      status = #pending;
      createdAt = Time.now();
    });
    carts.add(caller, List.empty<CartItem>());
    id;
  };

  public query ({ caller }) func getMyOrders() : async [Order] {
    let result = List.empty<Order>();
    for (order in orders.values()) {
      if (order.userId == caller) { result.add(order) };
    };
    result.toArray();
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admins only");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admins only");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { orders.add(orderId, { order with status }) };
    };
  };

  // ── Stripe ────────────────────────────────────────────────────────────────
  public shared ({ caller }) func setStripeSecretKey(key : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admins only");
    };
    stripeSecretKey := key;
  };

  public shared ({ caller }) func createStripeCheckoutSession(successUrl : Text, cancelUrl : Text) : async Text {
    if (stripeSecretKey == "") {
      Runtime.trap("Stripe is not configured");
    };
    let cartItems = switch (carts.get(caller)) {
      case (?list) { list.toArray() };
      case (null) { [] };
    };
    if (cartItems.size() == 0) {
      Runtime.trap("Cart is empty");
    };
    let shoppingItems = List.empty<Stripe.ShoppingItem>();
    for (item in cartItems.vals()) {
      switch (products.get(item.productId)) {
        case (?p) {
          shoppingItems.add({
            currency = "usd";
            productName = p.name;
            productDescription = p.description;
            priceInCents = p.priceInCents;
            quantity = item.quantity;
          });
        };
        case (null) {};
      };
    };
    let config : Stripe.StripeConfiguration = {
      secretKey = stripeSecretKey;
      allowedCountries = ["US", "CA", "GB"];
    };
    await Stripe.createCheckoutSession(config, caller, shoppingItems.toArray(), successUrl, cancelUrl, transform);
  };
}
