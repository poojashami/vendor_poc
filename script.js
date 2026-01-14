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
      price: "₹15.00",
      img: "https://images.unsplash.com/photo-1534452283893-eb0a010d7a0c?auto=format&fit=crop&q=80&w=400",
    },
  ];

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
                        <div class="material-img" style="background-image: url('${p.img
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
                                    <input type="number" class="form-control form-control-sm mat-price" value="${p.defaultPrice
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
    alert(
      "Order Submitted Successfully!\nItems: " +
      items.length +
      "\nTotal: " +
      formData.grandTotal
    );

    // Reset (Optional)
    // $('.material-card').removeClass('selected');
    // updateSelectionState();
    // $('#materialForm')[0].reset();
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

  // Add material row
  $("#addDistMaterialRowBtn").click(function () {
    distMaterialRowCounter++;
    const newRow = `
            <tr class="dist-material-row">
                <td class="text-center dist-material-number">${distMaterialRowCounter}</td>
                <td>
                    <select class="form-select dist-material-name" required>
                        <option value="" selected disabled>Select Material</option>
                        <option value="Floral Summer Maxidress" data-current="100" data-price="29.99">Floral Summer Maxidress</option>
                        <option value="Silk Embroidered Saree" data-current="100" data-price="105.00">Silk Embroidered Saree</option>
                        <option value="High-Waist Trousers" data-current="150" data-price="35.50">High-Waist Trousers</option>
                        <option value="Designer Kurti Set" data-current="80" data-price="42.00">Designer Kurti Set</option>
                        <option value="Cotton Fabric" data-current="200" data-price="15.00">Cotton Fabric</option>
                        <option value="Silk Thread" data-current="500" data-price="8.50">Silk Thread</option>
                        <option value="Metal Buttons" data-current="1000" data-price="2.00">Metal Buttons</option>
                        <option value="Zippers Pack" data-current="300" data-price="5.00">Zippers Pack</option>
                        <option value="Packaging Box" data-current="250" data-price="3.50">Packaging Box</option>
                        <option value="Leather Belt" data-current="120" data-price="25.00">Leather Belt</option>
                    </select>
                </td>
                <td>
                    <input type="number" class="form-control bg-light dist-current-qty" readonly value="0">
                </td>
                <td>
                    <input type="number" class="form-control dist-selling-qty" min="1" value="0" required>
                </td>
                <td>
                    <input type="text" class="form-control bg-light dist-amount" readonly value="₹0.00">
                </td>
                <td class="text-center">
                    <button type="button" class="btn btn-sm btn-danger remove-dist-material-row">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    $("#distributorMaterialRows").append(newRow);
    updateDistMaterialRowNumbers();
  });

  // Remove material row
  $(document).on("click", ".remove-dist-material-row", function () {
    $(this).closest(".dist-material-row").remove();
    updateDistMaterialRowNumbers();
    calculateDistGrandTotal();
  });

  // Cancel button
  $("#cancelDistBtn").click(function () {
    if (confirm("Are you sure you want to cancel? All data will be lost.")) {
      $("#distributorForm")[0].reset();
      $("#distributorMaterialRows .dist-material-row:not(:first)").remove();
      $(
        "#distributorMaterialRows .dist-material-row:first .dist-current-qty"
      ).val("0");
      $("#distributorMaterialRows .dist-material-row:first .dist-amount").val(
        "₹0.00"
      );
      $("#distGrandTotal").text("₹0.00");
      distMaterialRowCounter = 1;
      updateDistMaterialRowNumbers();
    }
  });

  // Form submission
  $("#distributorForm").submit(function (e) {
    e.preventDefault();

    // Validate distributor selected
    if (!$("#distributorName").val()) {
      alert("Please select a distributor!");
      return;
    }

    // Validate at least one material
    let hasValidMaterial = false;
    $("#distributorMaterialRows .dist-material-row").each(function () {
      const materialName = $(this).find(".dist-material-name").val();
      const sellingQty = parseInt($(this).find(".dist-selling-qty").val()) || 0;
      if (materialName && sellingQty > 0) {
        hasValidMaterial = true;
      }
    });

    if (!hasValidMaterial) {
      alert("Please add at least one material with selling quantity!");
      return;
    }

    // Collect form data
    const materials = [];
    $("#distributorMaterialRows .dist-material-row").each(function () {
      const materialName = $(this).find(".dist-material-name").val();
      const currentQty = $(this).find(".dist-current-qty").val();
      const sellingQty = $(this).find(".dist-selling-qty").val();
      const amount = $(this).find(".dist-amount").val();

      if (materialName && parseInt(sellingQty) > 0) {
        materials.push({
          name: materialName,
          currentQty: currentQty,
          sellingQty: sellingQty,
          amount: amount,
        });
      }
    });

    const distributionData = {
      distributor: $("#distributorName").val(),
      materials: materials,
      totalAmount: $("#distGrandTotal").text(),
      remarks: $("#distRemarks").val(),
    };

    console.log("Distribution submitted:", distributionData);

    let summary = "Distributor: " + distributionData.distributor + "\n\n";
    summary += "Materials:\n";
    materials.forEach((m, i) => {
      summary += i + 1 + ". " + m.name + "\n";
      summary +=
        "   Selling Qty: " + m.sellingQty + " | Amount: " + m.amount + "\n";
    });
    summary += "\nTotal Amount: " + distributionData.totalAmount;

    alert("Distribution Submitted Successfully!\n\n" + summary);
  });

  // ========== WAREHOUSE ACCEPTANCE LOGIC (SAFE ADDITION) ==========
  const shipments = [
    {
      id: 'ORD-8821',
      dispatchDate: '2026-01-10',
      warehouse: 'Delhi',
      items: [{ name: 'Cotton Fabric', qty: 500 }, { name: 'Zippers Pack', qty: 200 }],
      grandTotal: '₹7,500.00',
      status: 'Pending'
    },
    {
      id: 'ORD-9932',
      dispatchDate: '2026-01-12',
      warehouse: 'Madrid',
      items: [{ name: 'Floral Summer Maxidress', qty: 50 }],
      grandTotal: '₹1,499.50',
      status: 'Pending'
    },
    {
      id: 'ORD-7745',
      dispatchDate: '2026-01-14',
      warehouse: 'Barcelona',
      items: [{ name: 'Silk Embroidered Saree', qty: 20 }, { name: 'Jewelry Set', qty: 10 }],
      grandTotal: '₹2,285.00',
      status: 'Pending'
    }
  ];


  // Global function to accept shipment
  window.acceptShipment = function (id) {
    const shipment = shipments.find(s => s.id === id);
    if (shipment) {
      shipment.status = 'Received';
      alert(`Success! Stock from Order ${shipment.id} has been added to ${shipment.warehouse} inventory.`);

      // Re-render to show updated status
      const activeFilter = $('#warehouseTabs .nav-link.active').data('filter');
      renderShipments(activeFilter);
    }
  };

  function renderShipments(filter = 'All') {
    const tableBody = $('#shipmentTableBody');
    tableBody.empty();

    const filteredShipments = shipments.filter(s => {
      if (filter === 'All') return true;
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

    filteredShipments.forEach(s => {
      const itemSummary = s.items.length > 1
        ? `${s.items[0].name} + ${s.items.length - 1} more`
        : s.items[0].name;

      // Status Badge Logic
      let statusBadge = '';
      let actionBtn = '';

      if (s.status === 'Pending') {
        statusBadge = '<span class="badge bg-warning text-dark">Pending Acceptance</span>';
        actionBtn = `
                  <button class="btn btn-sm btn-success me-1" onclick="acceptShipment('${s.id}')">
                      <i class="fas fa-check me-1"></i> Accept
                  </button>
                  <button class="btn btn-sm btn-outline-primary" onclick="alert('Viewing Details for ${s.id}')">
                      View
                  </button>
              `;
      } else {
        statusBadge = '<span class="badge bg-success">Received</span>';
        actionBtn = `
                  <button class="btn btn-sm btn-outline-secondary" disabled>
                      <i class="fas fa-check-double me-1"></i> Done
                  </button>
                  <button class="btn btn-sm btn-outline-primary" onclick="alert('Viewing Details for ${s.id}')">
                      View
                  </button>
              `;
      }

      const row = `
              <tr>
                  <td><span class="badge bg-secondary">${s.id}</span></td>
                  <td>${s.dispatchDate || 'N/A'}</td>
                  <td>${s.warehouse}</td>
                  <td>
                      <div class="d-flex flex-column">
                          <span class="fw-bold small">${itemSummary}</span>
                          <span class="text-muted small">${s.items.length} items</span>
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
  $('#warehouseTabs .nav-link').click(function (e) {
    e.preventDefault();
    // Only affect tabs within this specific container
    $('#warehouseTabs .nav-link').removeClass('active');
    $(this).addClass('active');

    const filter = $(this).data('filter');
    renderShipments(filter);
  });
});
