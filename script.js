$(document).ready(function () {
  // Hard-coded Data
  const products = [
    {
      id: 1,
      name: "Floral Summer Maxidress",
      vendor: "Vendor 1 (Women Wear)",
      price: "₹29.99",
      img: "assets/product1.png",
    },
    {
      id: 2,
      name: "Silk Embroidered Saree",
      vendor: "Vendor 1 (Women Wear)",
      price: "₹105.00",
      img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=400",
    },
    {
      id: 3,
      name: "Formal Silk Shirt",
      vendor: "Vendor 2 (Men Wear)",
      price: "₹45.99",
      img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=400",
    },
    {
      id: 4,
      name: "Classic Denim Jacket",
      vendor: "Vendor 2 (Men Wear)",
      price: "₹59.00",
      img: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&q=80&w=400",
    },
    {
      id: 5,
      name: "Leather Handbag",
      vendor: "Vendor 3 (Accessories)",
      price: "₹120.00",
      img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=400",
    },
    {
      id: 6,
      name: "High-Waist Trousers",
      vendor: "Vendor 1 (Women Wear)",
      price: "₹35.50",
      img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=400",
    },
    {
      id: 7,
      name: "Designer Kurti Set",
      vendor: "Vendor 1 (Women Wear)",
      price: "₹42.00",
      img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400",
    },
    {
      id: 8,
      name: "Casual Polo",
      vendor: "Vendor 2 (Men Wear)",
      price: "₹25.00",
      img: "https://images.unsplash.com/photo-1574245428935-3dd8965f375c?auto=format&fit=crop&q=80&w=400",
    },
    {
      id: 9,
      name: "Premium Sunglasses",
      vendor: "Vendor 3 (Accessories)",
      price: "₹85.00",
      img: "https://images.unsplash.com/photo-1539109132382-381bb3f1c261?auto=format&fit=crop&q=80&w=400",
    },
    {
      id: 10,
      name: "Cotton Scarf",
      vendor: "Vendor 3 (Accessories)",
      img: "https://images.unsplash.com/photo-1534452283893-eb0a010d7a0c?auto=format&fit=crop&q=80&w=400",
    },
  ];

  // Global Shipments Array (Moved to Top for Access)
  const shipments = [
    {
      id: "ORD-8821",
      dispatchDate: "2026-01-10",
      warehouse: "Delhi",
      items: [
        { name: "Cotton Fabric", qty: 500 },
        { name: "Zippers Pack", qty: 200 },
      ],
      grandTotal: "₹7,500.00",
      status: "Pending",
    },
    {
      id: "ORD-9932",
      dispatchDate: "2026-01-12",
      warehouse: "Madrid",
      items: [{ name: "Floral Summer Maxidress", qty: 50 }],
      grandTotal: "₹1,499.50",
      status: "Pending",
    },
    {
      id: "ORD-7745",
      dispatchDate: "2026-01-14",
      warehouse: "Barcelona",
      items: [
        { name: "Silk Embroidered Saree", qty: 20 },
        { name: "Jewelry Set", qty: 10 },
      ],
      grandTotal: "₹2,285.00",
      status: "Pending",
    },
  ];

  // ========== POST-DISPATCH STATE (Retail & Invoices) ==========
  const retailerInventory = {
    Madrid: [],
    Barcelona: [],
  };

  const generatedInvoices = [];

  function renderRetailAndInvoices() {
    // 1. Render Retail Stock Table
    const levelRows = [];
    // Calculate summaries per retailer (Destination Hub)
    for (const [seller, items] of Object.entries(retailerInventory)) {
      if (items.length === 0) continue;

      let totalQty = 0;
      let totalVal = 0;
      items.forEach((i) => {
        totalQty += i.qty;
        totalVal += i.totalEUR;
      });

      levelRows.push(`
        <tr>
          <td><span class="fw-bold text-primary">${seller}</span></td>
          <td>${new Date().toLocaleDateString()}</td>
          <td>${items.length} types</td>
          <td class="text-center fw-bold">${totalQty}</td>
          <td class="text-end fw-bold">€${totalVal.toFixed(2)}</td>
        </tr>
      `);
    }

    if (levelRows.length === 0) {
      $("#retailLevelTableBody").html(
        '<tr><td colspan="5" class="text-center text-muted py-4">No retail stock updates yet.</td></tr>'
      );
    } else {
      $("#retailLevelTableBody").html(levelRows.join(""));
    }

    // 2. Render Invoices Table
    const invRows = generatedInvoices.map(
      (inv) => `
      <tr>
        <td><span class="badge bg-light text-dark border">${inv.id}</span></td>
        <td>${inv.retailer}</td>
        <td>${inv.date}</td>
        <td class="fw-bold text-success">€${inv.amount.toFixed(2)}</td>
        <td><span class="badge bg-success">Invoiced</span></td>
        <td><button class="btn btn-sm btn-outline-primary" onclick="viewInvoice('${
          inv.id
        }')"><i class="fas fa-eye"></i></button></td>
      </tr>
    `
    );

    if (invRows.length === 0) {
      $("#invoiceTableBody").html(
        '<tr><td colspan="6" class="text-center text-muted py-4">No invoices generated yet.</td></tr>'
      );
    } else {
      $("#invoiceTableBody").html(invRows.join(""));
    }
  }

  // Global Function to View Invoice (Modal Version)
  window.viewInvoice = function (id) {
    const inv = generatedInvoices.find((i) => i.id === id);
    if (!inv) return;

    // Populate Modal Elements
    $("#modalInvoiceId").text("#" + inv.id);
    $("#modalInvoiceTo").text(inv.retailer);
    $("#modalInvoiceDate").text(inv.date);

    const itemsBody = $("#modalInvoiceItemsBody");
    itemsBody.empty();

    let calculatedSubtotal = 0;

    inv.items.forEach((item) => {
      // Logic for Multi-Currency Handling
      let priceEUR = 0;
      let totalEUR = 0;

      if (typeof item.amount === "number") {
        // NEW LOGIC: Stored directly as Euro
        totalEUR = item.amount;
        priceEUR = totalEUR / parseInt(item.sellingQty);
      } else {
        // OLD LOGIC: Stored as INR String (Backward Compatibility)
        const priceINR =
          parseFloat(item.amount.replace("₹", "").replace(/,/g, "")) /
          parseInt(item.sellingQty);
        priceEUR = priceINR / 90;
        totalEUR = priceEUR * parseInt(item.sellingQty);
      }

      calculatedSubtotal += totalEUR;

      itemsBody.append(`
            <tr>
                <td class="ps-3 fw-medium">${item.name}</td>
                <td class="text-center">${item.sellingQty}</td>
                <td class="text-end">€${priceEUR.toFixed(2)}</td>
                <td class="text-end pe-3 fw-bold">€${totalEUR.toFixed(2)}</td>
            </tr>
          `);
    });

    const tax = calculatedSubtotal * 0.15;
    const grandTotal = calculatedSubtotal + tax;

    $("#modalInvoiceSubtotal").text("€" + calculatedSubtotal.toFixed(2));
    $("#modalInvoiceTax").text("€" + tax.toFixed(2));
    $("#modalInvoiceTotal").text("€" + grandTotal.toFixed(2));

    // Show Modal
    const modal = new bootstrap.Modal(document.getElementById("invoiceModal"));
    modal.show();
  };

  // Render Product Grid
  function renderProducts() {
    let html = "";
    products.forEach((p) => {
      html += `
                <div class="col-md-3 mb-4">
                    <div class="product-card shadow-sm">
                        <div class="product-img" style="background-image: url('${p.img}')"></div>
                        <div class="product-info">
                            <div class="product-title">${p.name}</div>
                            <div class="product-vendor">${p.vendor}</div>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="product-price">${p.price}</span>
                                <button class="btn btn-sm btn-primary rounded-pill"><i class="fas fa-plus"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
    });
    $("#product-grid").html(html);
  }

  renderProducts();

  // Main Sidebar Tab Switching (Strict)
  $(".nav-link").click(function () {
    const tab = $(this).data("tab");

    // CRITICAL FIX: Ignore clicks on sub-tabs (like Warehouse tabs) that don't have 'data-tab'
    if (!tab) return;

    $(".sidebar .nav-link").removeClass("active");
    $(this).addClass("active");

    $(".tab-content").hide();
    $("#" + tab).show();
  });

  // Dispatch Logic
  $("#btnApproveDispatch").click(function () {
    const product = $("#dispatchProduct").val();
    const price = parseFloat(
      $("#dispatchProduct option:selected").data("price")
    );
    const hub = $("#dispatchHub").val();
    const retailer = $("#dispatchRetailer").val();
    const qty = parseInt($("#dispatchQty").val());

    // Calculate Totals
    const subtotal = price * qty;
    const tax = subtotal * 0.15; // 15% Tax as per doc
    const total = subtotal + tax;

    // Populate Modal
    $("#invoiceTo").text(`${hub} - ${retailer}`);
    $("#invoiceItems").html(`
            <tr>
                <td>${product}</td>
                <td class="text-end">${qty}</td>
                <td class="text-end">₹${price.toFixed(2)}</td>
                <td class="text-end">₹${subtotal.toFixed(2)}</td>
            </tr>
        `);
    $("#invoiceSubtotal").text("₹" + subtotal.toFixed(2));
    $("#invoiceTax").text("₹" + tax.toFixed(2));
    $("#invoiceTotal").text("₹" + total.toFixed(2));

    // Show Modal
    const invoiceModal = new bootstrap.Modal(
      document.getElementById("invoiceModal")
    );
    invoiceModal.show();
  });

  // Vendor Material Form Logic - Image Grid Implementation

  // 10 Women's Wear Products
  const materialProducts = [
    {
      id: "m1",
      name: "Kurta Set",
      defaultPrice: 300,
      img: "./assets/images/kurta set.jpg",
    },
    {
      id: "m2",
      name: "Designer Kurta",
      defaultPrice: 500,
      img: "./assets/images/designerkurta.jpg",
    },
    {
      id: "m3",
      name: "High-Waist Trousers",
      defaultPrice: 700,
      img: "./assets/images/highwaist_trouser.jpg",
    },
    {
      id: "m4",
      name: "Women Top",
      defaultPrice: 350,
      img: "./assets/images/women_top.jpg",
    },
    {
      id: "m5",
      name: "Cotton Kurta",
      defaultPrice: 280,
      img: "./assets/images/cotton_kurta.jpg",
    },
    {
      id: "m6",
      name: "High Waist Jeans",
      defaultPrice: 999,
      img: "./assets/images/highwaist_jeans.jpg",
    },
    {
      id: "m7",
      name: "Formal Office Shirt",
      defaultPrice: 399,
      img: "./assets/images/formal_shirt.jpg",
    },
    {
      id: "m8",
      name: "Ethenic Wear",
      defaultPrice: 2051,
      img: "./assets/images/ethenic_wear.jpg",
    },
    {
      id: "m9",
      name: "Fashion Scarf/Stole",
      defaultPrice: 150,
      img: "./assets/images/scarf_stall.jpg", // Reusing as fallback
    },
    {
      id: "m10",
      name: "Western Dress",
      defaultPrice: 800,
      img: "./assets/images/western_dress.jpg", // Reusing as fallback
    },
  ];

  function renderMaterialGrid() {
    const container = $("#material-selection-grid");
    container.empty();

    materialProducts.forEach((p) => {
      const card = `
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="material-card h-100" data-id="${p.id}">
                        <div class="material-img" style="background-image: url('${
                          p.img
                        }')">
                            <div class="check-overlay">
                                <i class="fas fa-check"></i>
                            </div>
                        </div>
                        <div class="material-details">
                            <h6 class="fw-bold mb-1 show-name">${p.name}</h6>
                            <div class="d-flex card-inputs" onclick="event.stopPropagation()">
                                <div class="mb-2">
                                    <label class="form-label small mb-0">Price (₹)</label>
                                    <input type="number" class="form-control form-control-sm mat-price" value="${
                                      p.defaultPrice
                                    }" step="0.01" min="0">
                                </div>
                                <div class="mb-2">
                                    <label class="form-label small mb-0">Quantity</label>
                                    <input type="number" class="form-control form-control-sm mat-qty" value="1" min="1">
                                </div>
                                <div class=" bg-light p-2 rounded">
                                   <label class="form-label small mb-0">Total</label></br>
                                    <span class="small fw-bold mat-total text-primary">₹${p.defaultPrice.toFixed(
                                      2
                                    )}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
      container.append(card);
    });
  }

  // Call render initially
  renderMaterialGrid();

  // Interaction Logic
  $(document).on("click", ".material-card", function (e) {
    // Prevent toggling if clicking inside inputs
    if ($(e.target).closest(".card-inputs").length) return;

    $(this).toggleClass("selected");
    updateSelectionState();
  });

  // Input Change Logic
  $(document).on("input", ".mat-price, .mat-qty", function () {
    const card = $(this).closest(".material-card");
    const price = parseFloat(card.find(".mat-price").val()) || 0;
    const qty = parseInt(card.find(".mat-qty").val()) || 1;

    const total = price * qty;
    card.find(".mat-total").text("₹" + total.toFixed(2));
    updateSelectionState(); // To update grand total
  });

  function updateSelectionState() {
    let grandTotal = 0;
    let selectedCount = 0;

    $(".material-card.selected").each(function () {
      selectedCount++;
      const price = parseFloat($(this).find(".mat-price").val()) || 0;
      const qty = parseInt($(this).find(".mat-qty").val()) || 1;
      grandTotal += price * qty;
    });

    $("#grandTotal").text("₹" + grandTotal.toFixed(2));

    // Toggle visibility of dispatch section based on selection
    if (selectedCount > 0) {
      $("#dispatch-section").fadeIn();
      $("#empty-selection-msg").hide();
    } else {
      $("#dispatch-section").hide();
      $("#empty-selection-msg").fadeIn();
    }
  }

  // Form Submission
  $("#materialForm").submit(function (e) {
    e.preventDefault();

    const selectedCards = $(".material-card.selected");
    if (selectedCards.length === 0) {
      alert("Please select at least one product.");
      return;
    }

    const items = [];
    selectedCards.each(function () {
      items.push({
        name: $(this).find(".show-name").text(),
        price: $(this).find(".mat-price").val(),
        qty: $(this).find(".mat-qty").val(),
        total: $(this).find(".mat-total").text(),
      });
    });

    const formData = {
      items: items,
      warehouse: $("#dispatchWarehouse").val(),
      dispatchDate: $("#dispatchDate").val(),
      expectedDate: $("#expectedDate").val(),
      remarks: $("#remarks").val(),
      grandTotal: $("#grandTotal").text(),
    };

    console.log("Submitted Data:", formData);

    // Create new shipment object for Warehouse Acceptance
    const newShipmentId = "ORD-" + Math.floor(1000 + Math.random() * 9000); // Random ID
    const newShipment = {
      id: newShipmentId,
      dispatchDate:
        formData.dispatchDate || new Date().toISOString().split("T")[0],
      warehouse: formData.warehouse || "Delhi",
      items: items, // reuse the items array
      grandTotal: formData.grandTotal,
      status: "Pending",
    };

    // Push to global shipments array
    shipments.unshift(newShipment); // Add to top

    alert(
      "Order Submitted Successfully!\n\n" +
        "Order ID: " +
        newShipmentId +
        "\n" +
        "Sent to: " +
        newShipment.warehouse +
        " Warehouse\n" +
        "Total: " +
        formData.grandTotal +
        "\n\n" +
        "Check 'Warehouse Acceptance' tab to approve stock."
    );

    // Reset Form
    $(".material-card").removeClass("selected");
    updateSelectionState();
    $("#materialForm")[0].reset();
    $("#material-selection-grid").empty();
    renderMaterialGrid(); // Re-render to clear selection visuals

    // Trigger re-render of shipments (if user switches tab immediately)
    // However, keeping data sync is key.
  });

  // ========== MATERIAL DISTRIBUTOR LOGIC (REDESIGNED) ==========
  let distMaterialRowCounter = 1;

  // Function to update material row numbers
  function updateDistMaterialRowNumbers() {
    $("#distributorMaterialRows .dist-material-row").each(function (index) {
      $(this)
        .find(".dist-material-number")
        .text(index + 1);
    });

    const rowCount = $("#distributorMaterialRows .dist-material-row").length;
    if (rowCount === 1) {
      $(".remove-dist-material-row").prop("disabled", true);
    } else {
      $(".remove-dist-material-row").prop("disabled", false);
    }
  }

  // Function to calculate row amount
  function calculateDistRowAmount(row) {
    const selectedOption = row.find(".dist-material-name option:selected");
    const price = parseFloat(selectedOption.data("price")) || 0;
    const sellingQty = parseInt(row.find(".dist-selling-qty").val()) || 0;
    const amount = price * sellingQty;
    row.find(".dist-amount").val("₹" + amount.toFixed(2));
    calculateDistGrandTotal();
  }

  // Function to calculate grand total
  function calculateDistGrandTotal() {
    let grandTotal = 0;
    $("#distributorMaterialRows .dist-material-row").each(function () {
      const amountText = $(this).find(".dist-amount").val().replace("₹", "");
      const amount = parseFloat(amountText) || 0;
      grandTotal += amount;
    });
    $("#distGrandTotal").text("₹" + grandTotal.toFixed(2));
  }

  // Event: Material name selection - auto-fill current qty
  $(document).on("change", ".dist-material-name", function () {
    const selectedOption = $(this).find("option:selected");
    const currentQty = selectedOption.data("current") || 0;
    const row = $(this).closest(".dist-material-row");
    row.find(".dist-current-qty").val(currentQty);
    calculateDistRowAmount(row);
  });

  // Event: Selling qty change
  $(document).on("input", ".dist-selling-qty", function () {
    const row = $(this).closest(".dist-material-row");
    const currentQty = parseInt(row.find(".dist-current-qty").val()) || 0;
    const sellingQty = parseInt($(this).val()) || 0;

    // Validate selling qty doesn't exceed current qty
    if (sellingQty > currentQty) {
      alert(
        "Selling quantity cannot exceed current quantity (" + currentQty + ")!"
      );
      $(this).val(currentQty);
    }

    calculateDistRowAmount(row);
  });

  // ========== CENTRALIZED INVENTORY & RETAIL DISPATCH LOGIC ==========

  // 1. Central Inventory State (The "Hardcoded" Data Source)
  const warehouseInventory = {
    "Floral Summer Maxidress": 120, // High stock
    "Silk Embroidered Saree": 45,
    "High-Waist Trousers": 200,
    "Designer Kurti Set": 75,
    "Cotton Fabric": 500,
    "Silk Thread": 1000,
    "Metal Buttons": 2000,
    "Zippers Pack": 150,
    "Packaging Box": 0, // Out of stock example
    "Leather Belt": 80,
  };

  const itemPrices = {
    "Floral Summer Maxidress": 29.99,
    "Silk Embroidered Saree": 105.0,
    "High-Waist Trousers": 35.5,
    "Designer Kurti Set": 42.0,
    "Cotton Fabric": 15.0,
    "Silk Thread": 8.5,
    "Metal Buttons": 2.0,
    "Zippers Pack": 5.0,
    "Packaging Box": 3.5,
    "Leather Belt": 25.0,
  };

  // ========== SELLER ORDERS / RETAIL DISPATCH LOGIC (VISUAL GRID) ==========

  // Function to render the Distributor Product Grid (from Warehouse Inventory)
  function renderDistributorGrid() {
    const container = $("#distributor-product-grid");
    container.empty();

    // Iterate over warehouse inventory
    let index = 0;
    for (const [itemName, currentStock] of Object.entries(warehouseInventory)) {
      index++;
      // Try to find image from products array, or use a default
      const productMatch = products.find((p) => p.name === itemName);
      const imgUrl = productMatch
        ? productMatch.img
        : "https://placehold.co/400x300?text=No+Image";

      const isOutOfStock = currentStock <= 0;
      const opacityClass = isOutOfStock ? "opacity-50 grayscale" : "";

      const card = `
        <div class="col-6 col-md-4 col-lg-3">
            <div class="material-card h-100 ${opacityClass}" data-name="${itemName}" style="${
        isOutOfStock ? "pointer-events: none;" : ""
      }">
                <div class="material-img position-relative" style="background-image: url('${imgUrl}')">
                    <!-- Stock Top Left -->
                    <span class="position-absolute top-0 start-0 m-2 badge bg-primary shadow-sm">Stock: ${currentStock}</span>
                    
                    <!-- Checkbox Top Right -->
                    <div class="position-absolute top-0 end-0 m-2">
                         <div class="form-check">
                            <input class="form-check-input card-checkbox" type="checkbox" style="transform: scale(1.2); cursor: pointer;" ${
                              isOutOfStock ? "disabled" : ""
                            }>
                        </div>
                    </div>
                </div>
                <div class="material-details">
                    <h6 class="fw-bold mb-1 show-name text-truncate" title="${itemName}">${itemName}</h6>
                    
                    <!-- Inputs (Hidden by default) -->
                    <div class="card-inputs mt-2" style="display: none;" onclick="event.stopPropagation()">
                        <div class="row g-1 align-items-end">
                            <!-- Price Input (Euro) -->
                            <div class="col-4">
                                <div class="mb-0">
                                    <label class="form-label small mb-0">Price (€)</label>
                                    <input type="number" class="form-control form-control-sm dist-price px-1 text-center" 
                                           placeholder="0" step="0.01" min="0">
                                </div>
                            </div>

                            <!-- Qty Input -->
                             <div class="col-4">
                                <div class="mb-0">
                                    <label class="form-label small mb-0 d-flex justify-content-between">
                                        <span>Qty</span>
                                    </label>
                                    <input type="number" class="form-control form-control-sm dist-qty px-1 text-center" 
                                           value="1" min="1" max="${currentStock}" 
                                           ${isOutOfStock ? "disabled" : ""}>
                                </div>
                            </div>
                            
                            <!-- Total -->
                            <div class="col-4">
                                <div class="bg-light p-1 rounded border border-light text-center h-100 d-flex flex-column justify-content-center">
                                   <label class="form-label small mb-0 lh-1">Total</label>
                                    <span class="small fw-bold dist-total text-primary mt-1">€0.00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      `;
      container.append(card);
    }
  }

  // Initial Render
  renderDistributorGrid();

  // Interaction: Select Card (Toggle)
  $(document).on(
    "click",
    "#distributor-product-grid .material-card",
    function (e) {
      if ($(e.target).closest(".card-inputs").length) return; // Ignore clicks inside inputs
      if ($(e.target).hasClass("card-checkbox")) {
        // Did click the checkbox directly? Let it propagate or handle logic here
        // The default checkbox behavior handles the 'checked' state visually
        // We just need to sync the card UI
      } else {
        // Clicked card body/image -> Toggle checkbox
        const checkbox = $(this).find(".card-checkbox");
        checkbox.prop("checked", !checkbox.prop("checked"));
      }

      const isSelected = $(this).find(".card-checkbox").prop("checked");
      const inputSection = $(this).find(".card-inputs");

      if (isSelected) {
        $(this).addClass("selected");
        inputSection.slideDown(200); // Animation for nice effect
      } else {
        $(this).removeClass("selected");
        inputSection.slideUp(200);
        // Optional: Reset inputs on deselect? No, keep them for UX
      }
      updateDistributorSelectionState();
    }
  );

  // Interaction: Input Change (Price or Qty)
  $(document).on("input", ".dist-qty, .dist-price", function () {
    const card = $(this).closest(".material-card");
    const stock = parseInt(card.find(".dist-qty").attr("max"));

    // Qty Validation
    let qty = parseInt(card.find(".dist-qty").val()) || 0;
    if (qty > stock) {
      alert(`Cannot dispatch more than available stock (${stock})!`);
      qty = stock;
      card.find(".dist-qty").val(qty);
    }
    if (qty < 0) qty = 0;

    // Price
    const price = parseFloat(card.find(".dist-price").val()) || 0;

    // Calculate Row Total
    const total = price * qty;
    card.find(".dist-total").text("€" + total.toFixed(2));

    // Auto-select card if inputs actvated
    if (!card.hasClass("selected") && price > 0 && qty > 0) {
      card.addClass("selected");
    }
    updateDistributorSelectionState();
  });

  function updateDistributorSelectionState() {
    let grandTotal = 0;
    $("#distributor-product-grid .material-card.selected").each(function () {
      const price = parseFloat($(this).find(".dist-price").val()) || 0;
      const qty = parseInt($(this).find(".dist-qty").val()) || 0;
      grandTotal += price * qty;
    });
    $("#distGrandTotal").text("€" + grandTotal.toFixed(2));
  }

  // Cancel Button
  $("#cancelDistBtn").click(function () {
    if (confirm("Clear all selections?")) {
      renderDistributorGrid();
      updateDistributorSelectionState();
      $("#distributorForm")[0].reset();
    }
  });

  // Form submission
  $("#distributorForm").submit(function (e) {
    e.preventDefault();

    // Validate Destination
    const destination = $("input[name='destinationHub']:checked").val();
    if (!destination) {
      alert("Please select a valid destination (Madrid or Barcelona)!");
      return;
    }

    // Validate at least one material
    const selectedCards = $(
      "#distributor-product-grid .material-card.selected"
    );
    if (selectedCards.length === 0) {
      alert("Please select at least one item to dispatch!");
      return;
    }

    // Collect Data
    const materials = [];
    selectedCards.each(function () {
      const name = $(this).data("name");
      const sellingQty = parseInt($(this).find(".dist-qty").val()) || 0;
      const priceEUR = parseFloat($(this).find(".dist-price").val()) || 0;
      const totalEUR = priceEUR * sellingQty;

      if (sellingQty > 0) {
        materials.push({
          name: name,
          sellingQty: sellingQty,
          priceEUR: priceEUR,
          totalEUR: totalEUR,
        });
      }
    });

    if (materials.length === 0) {
      alert("Invalid quantities selected!");
      return;
    }

    const totalDispatchValue = materials.reduce(
      (sum, m) => sum + m.totalEUR,
      0
    );

    // --- POST DISPATCH ACTIONS ---

    // 1. Deduct from Central Inventory (Delhi)
    materials.forEach((m) => {
      if (warehouseInventory[m.name]) {
        warehouseInventory[m.name] -= m.sellingQty; // Reduce Stock
      }

      // Update "Retailer/Destination" Stock (Mock)
      if (!retailerInventory[destination]) retailerInventory[destination] = [];
      retailerInventory[destination].push({
        name: m.name,
        qty: m.sellingQty,
        totalEUR: m.totalEUR,
      });
    });

    // 2. Generate Invoice
    const invoiceId = "INV-" + Date.now().toString().slice(-6);
    generatedInvoices.unshift({
      id: invoiceId,
      retailer: destination, // Destination is effectively the retailer/branch here
      date: new Date().toLocaleDateString(),
      amount: totalDispatchValue, // Already in Euro
      items: materials.map((m) => ({
        name: m.name,
        sellingQty: m.sellingQty,
        amount: m.totalEUR, // Storing pure Euro value now
      })),
      status: "Paid",
    });

    // 3. UI Feedback
    alert(
      `Success! Dispatched to ${destination}.\n\nInvoice ${invoiceId} Generated.\nTotal Value: €${totalDispatchValue.toFixed(
        2
      )}`
    );

    // Reset Form
    $("#distributorForm")[0].reset();
    renderDistributorGrid(); // Re-render to show updated (reduced) stock
    updateDistributorSelectionState();

    // Force Render of new data
    renderRetailAndInvoices();
  });
  // ========== WAREHOUSE ACCEPTANCE LOGIC (SAFE ADDITION) ==========
  // shipments array moved to top of file
  // ];

  // Global function to accept shipment
  window.acceptShipment = function (id) {
    const shipment = shipments.find((s) => s.id === id);
    if (shipment) {
      shipment.status = "Received";
      alert(
        `Success! Stock from Order ${shipment.id} has been added to ${shipment.warehouse} inventory.`
      );

      // Re-render to show updated status
      const activeFilter = $("#warehouseTabs .nav-link.active").data("filter");
      renderShipments(activeFilter);
    }
  };

  // Warehouse Address Mapping
  const warehouseAddresses = {
    Delhi: {
      name: "Delhi Main Hub",
      address: "Okhla Phase III, New Delhi, India",
    },
    Madrid: {
      name: "Madrid Distribution Center",
      address: "Calle de Alcalá, 45, Madrid, Spain",
    },
    Barcelona: {
      name: "Barcelona Logistics Hub",
      address: "Carrer de la Marina, 18, Barcelona, Spain",
    },
  };

  // Vendor Address Mapping (Mock for now, assuming current user is Vendor 1)
  const currentVendor = {
    name: "Vendor 1 (Women Wear)",
    address: "Fashion Street, Delhi, India",
  };

  // Global function to view shipment details
  window.viewShipmentDetails = function (id) {
    const shipment = shipments.find((s) => s.id === id);
    if (!shipment) return;

    // Populate Order Info
    $("#modalOrderId").text(shipment.id);
    $("#modalDate").text(shipment.dispatchDate || "N/A");

    // Resolve Warehouse Details
    const whInfo = warehouseAddresses[shipment.warehouse] || {
      name: shipment.warehouse,
      address: "Main Warehouse",
    };

    // Update "To" Section
    $("#modalWarehouse").text(whInfo.name);
    $("#modalWarehouseAddress").text(whInfo.address); // Need to add this ID to HTML

    // Update "From" Section (Static for this POC or mock)
    // If shipments had vendorId we could map it, but for now we default to the current vendor context
    // or if the hardcoded shipments imply different vendors we could add that property.
    // Let's assume the hardcoded shipments are from "Vendor 1" for consistency, or we add vendor property.

    // For now, I will update the HTML to have IDs for From section too.
    $("#modalFromVendor").text(currentVendor.name);
    $("#modalFromAddress").text(currentVendor.address);

    $("#modalGrandTotal").text(shipment.grandTotal);

    // Status Badge
    let badge =
      shipment.status === "Pending"
        ? '<span class="badge bg-warning text-dark">Pending Acceptance</span>'
        : '<span class="badge bg-success">Received</span>';
    $("#modalStatusBadge").html(badge);

    // Populate Items Table
    const itemsBody = $("#modalItemsTable");
    itemsBody.empty();

    shipment.items.forEach((item) => {
      const priceDisplay = item.price ? `₹${item.price}` : "-";
      const totalDisplay = item.total ? item.total : "-";

      const row = `
              <tr>
                  <td>${item.name}</td>
                  <td class="text-end">${item.qty}</td>
                  <td class="text-end">${priceDisplay}</td>
                  <td class="text-end">${totalDisplay}</td>
              </tr>
          `;
      itemsBody.append(row);
    });

    // Show Modal
    const modal = new bootstrap.Modal(
      document.getElementById("shipmentDetailsModal")
    );
    modal.show();
  };

  function renderShipments(filter = "All") {
    const tableBody = $("#shipmentTableBody");
    tableBody.empty();

    const filteredShipments = shipments.filter((s) => {
      if (filter === "All") return true;
      return s.warehouse.includes(filter);
    });

    if (filteredShipments.length === 0) {
      tableBody.html(`
               <tr id="empty-shipment-msg">
                   <td colspan="7" class="text-center py-4 text-muted">
                       No shipments found for ${filter}.
                   </td>
               </tr>
           `);
      // Removed return to ensure table structure remains if needed
      return;
    }

    filteredShipments.forEach((s) => {
      const itemSummary =
        s.items.length > 1
          ? `${s.items[0].name} + ${s.items.length - 1} more`
          : s.items[0].name;

      // Status Badge Logic
      let statusBadge = "";
      let actionBtn = "";

      if (s.status === "Pending") {
        statusBadge =
          '<span class="badge bg-warning text-dark">Pending Acceptance</span>';
        actionBtn = `
                   <button class="btn btn-sm btn-success me-1" onclick="acceptShipment('${s.id}')">
                       <i class="fas fa-check me-1"></i> Accept
                   </button>
                   <button class="btn btn-sm btn-outline-primary" onclick="viewShipmentDetails('${s.id}')">
                       View
                   </button>
               `;
      } else {
        statusBadge = '<span class="badge bg-success">Received</span>';
        actionBtn = `
                   <button class="btn btn-sm btn-outline-secondary" disabled>
                       <i class="fas fa-check-double me-1"></i> Done
                   </button>
                   <button class="btn btn-sm btn-outline-primary" onclick="viewShipmentDetails('${s.id}')">
                       View
                   </button>
               `;
      }

      const row = `
               <tr>
                   <td><span class="badge bg-secondary">${s.id}</span></td>
                   <td>${s.dispatchDate || "N/A"}</td>
                   <td>${s.warehouse}</td>
                   <td>
                       <div class="d-flex flex-column">
                           <span class="fw-bold small">${itemSummary}</span>
                           <span class="text-muted small">${
                             s.items.length
                           } items</span>
                       </div>
                   </td>
                   <td class="fw-bold">${s.grandTotal}</td>
                   <td>${statusBadge}</td>
                   <td>
                       <div class="d-flex">
                           ${actionBtn}
                       </div>
                   </td>
               </tr>
           `;
      tableBody.append(row);
    });
  }

  // Initial Render
  renderShipments();

  // Warehouse Tab Click Handler (Specific to ID to avoid Main Tab Conflict)
  $("#warehouseTabs .nav-link").click(function (e) {
    e.preventDefault();
    // Only affect tabs within this specific container
    $("#warehouseTabs .nav-link").removeClass("active");
    $(this).addClass("active");

    const filter = $(this).data("filter");
    renderShipments(filter);
  });
});
