// Seller Orders Page JavaScript
$(document).ready(function () {

    // Hub Inventories (Mock data - will be replaced with PHP/DB later)
    const hubInventories = {
        Madrid: {
            "Floral Summer Maxidress": 50,
            "Silk Embroidered Saree": 25,
            "High-Waist Trousers": 80,
            "Designer Kurti Set": 40,
        },
        Barcelona: {
            "Floral Summer Maxidress": 45,
            "Silk Embroidered Saree": 20,
            "High-Waist Trousers": 70,
            "Designer Kurti Set": 35,
        },
    };

    const itemPrices = {
        "Floral Summer Maxidress": 29.99,
        "Silk Embroidered Saree": 105.0,
        "High-Waist Trousers": 35.5,
        "Designer Kurti Set": 42.0,
    };

    // Product images mapping
    const products = window.productsData || [];

    // Function to render distributor product grid
    function renderDistributorGrid(hub = "Madrid") {
        const container = $("#distributor-product-grid");
        container.empty();

        const inventory = hubInventories[hub] || hubInventories["Madrid"];

        for (const [itemName, currentStock] of Object.entries(inventory)) {
            const productMatch = products.find((p) => p.name === itemName);
            const imgUrl = productMatch
                ? productMatch.img
                : "https://placehold.co/400x300?text=No+Image";

            const isOutOfStock = currentStock <= 0;
            const opacityClass = isOutOfStock ? "opacity-50 grayscale" : "";

            const card = `
        <div class="col-6 col-md-4 col-lg-3">
            <div class="material-card h-100 ${opacityClass}" data-name="${itemName}" style="${isOutOfStock ? "pointer-events: none;" : ""
                }">
                <div class="material-img position-relative" style="background-image: url('${imgUrl}')">
                    <!-- Stock Top Left -->
                    <span class="position-absolute top-0 start-0 m-2 badge bg-primary shadow-sm">Stock: ${currentStock}</span>
                    
                    <!-- Checkbox Top Right -->
                    <div class="position-absolute top-0 end-0 m-2">
                         <div class="form-check">
                            <input class="form-check-input card-checkbox" type="checkbox" style="transform: scale(1.2); cursor: pointer;" ${isOutOfStock ? "disabled" : ""
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
    renderDistributorGrid("Madrid");

    // Interaction: Select Card (Toggle)
    $(document).on("click", "#distributor-product-grid .material-card", function (e) {
        if ($(e.target).closest(".card-inputs").length) return;

        if (!$(e.target).hasClass("card-checkbox")) {
            const checkbox = $(this).find(".card-checkbox");
            checkbox.prop("checked", !checkbox.prop("checked"));
        }

        const isSelected = $(this).find(".card-checkbox").prop("checked");
        const inputSection = $(this).find(".card-inputs");

        if (isSelected) {
            $(this).addClass("selected");
            inputSection.slideDown(200);
        } else {
            $(this).removeClass("selected");
            inputSection.slideUp(200);
        }
        updateDistributorSelectionState();
    });

    // Interaction: Input Change (Price or Qty)
    $(document).on("input", ".dist-qty, .dist-price", function () {
        const card = $(this).closest(".material-card");
        const stock = parseInt(card.find(".dist-qty").attr("max"));

        let qty = parseInt(card.find(".dist-qty").val()) || 0;
        if (qty > stock) {
            showNotification("Error", `Cannot dispatch more than available stock (${stock})!`, "error");
            qty = stock;
            card.find(".dist-qty").val(qty);
        }
        if (qty < 0) qty = 0;

        const price = parseFloat(card.find(".dist-price").val()) || 0;
        const total = price * qty;
        card.find(".dist-total").text("€" + total.toFixed(2));

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
        $("#distTotalAmount").val(grandTotal.toFixed(2));
        calculatePendingAmount();
    }

    function calculatePendingAmount() {
        const total = parseFloat($("#distTotalAmount").val()) || 0;
        const received = parseFloat($("#distAmountReceived").val()) || 0;
        const pending = total - received;
        $("#distAmtPending").val(pending.toFixed(2));
    }

    $(document).on("input", "#distAmountReceived", calculatePendingAmount);

    // Set default Booking Date to today
    $("#distBookingDate").val(new Date().toISOString().split("T")[0]);

    // Cancel Button
    $("#cancelDistBtn").click(function () {
        if (confirm("Clear all selections?")) {
            const hub = $("input[name='destinationHub']:checked").val() || "Madrid";
            renderDistributorGrid(hub);
            updateDistributorSelectionState();
            $("#distBookingDate").val(new Date().toISOString().split("T")[0]);
            $("#distAmountReceived").val(0);
            calculatePendingAmount();
        }
    });

    // Hub Change (Madrid/Barcelona)
    $(document).on("change", "input[name='destinationHub']", function () {
        const hub = $(this).val();
        renderDistributorGrid(hub);
        updateDistributorSelectionState();
    });

    // Form submission
    $("#distributorForm").submit(function (e) {
        e.preventDefault();

        const destination = $("input[name='destinationHub']:checked").val();
        if (!destination) {
            showNotification("Error", "Please select a valid destination (Madrid or Barcelona)!", "error");
            return;
        }

        const selectedCards = $("#distributor-product-grid .material-card.selected");
        if (selectedCards.length === 0) {
            showNotification("Error", "Please select at least one item to dispatch!", "error");
            return;
        }

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
            showNotification("Error", "Invalid quantities selected!", "error");
            return;
        }

        const totalDispatchValue = materials.reduce((sum, m) => sum + m.totalEUR, 0);
        const sellerName = $("#distSeller").val() || "General Retailer";
        const orderId = "ORD-" + Date.now().toString().slice(-6);

        // Deduct from hub inventory (in real app, this would be server-side)
        materials.forEach((m) => {
            if (hubInventories[destination] && hubInventories[destination][m.name] !== undefined) {
                hubInventories[destination][m.name] -= m.sellingQty;
            }
        });

        // Save to pending dispatch orders
        let pendingDispatchOrders = getFromStorage("pendingDispatchOrders", []);
        pendingDispatchOrders.unshift({
            id: orderId,
            destination: destination,
            amount: totalDispatchValue,
            items: materials,
            date: new Date().toLocaleDateString(),
            retailer: sellerName,
        });
        saveToStorage("pendingDispatchOrders", pendingDispatchOrders);

        showNotification(
            "Success!",
            `Order ${orderId} has been created and moved to 'Dispatch Material' for logistics assignment.`,
            "success"
        );

        // Reset Form
        this.reset();
        $("#distBookingDate").val(new Date().toISOString().split("T")[0]);
        $("#distAmountReceived").val(0);
        renderDistributorGrid(destination);
        updateDistributorSelectionState();
    });

    console.log("Seller Orders page loaded");
});
