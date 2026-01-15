// Vendor Material Entry Page JavaScript
$(document).ready(function () {
    // Material Products Data
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
            img: "./assets/images/scarf_stall.jpg",
        },
        {
            id: "m10",
            name: "Western Dress",
            defaultPrice: 800,
            img: "./assets/images/western_dress.jpg",
        },
    ];

    function renderMaterialGrid() {
        const container = $("#material-selection-grid");
        container.empty();

        materialProducts.forEach((p) => {
            const card = `
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="material-card h-100" data-id="${p.id}">
                        <div class="material-img" style="background-image: url('${p.img}')">
                            <div class="check-overlay">
                                <i class="fas fa-check"></i>
                            </div>
                        </div>
                        <div class="material-details">
                            <h6 class="fw-bold mb-1 show-name">${p.name}</h6>
                            <div class="d-flex card-inputs" onclick="event.stopPropagation()">
                                <div class="mb-2">
                                    <label class="form-label small mb-0">Price (₹)</label>
                                    <input type="number" class="form-control form-control-sm mat-price" value="${p.defaultPrice}" step="0.01" min="0">
                                </div>
                                <div class="mb-2">
                                    <label class="form-label small mb-0">Quantity</label>
                                    <input type="number" class="form-control form-control-sm mat-qty" value="1" min="1">
                                </div>
                                <div class="bg-light p-2 rounded">
                                   <label class="form-label small mb-0">Total</label></br>
                                    <span class="small fw-bold mat-total text-primary">₹${p.defaultPrice.toFixed(2)}</span>
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
        updateSelectionState();
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

        if (selectedCount > 0) {
            $("#dispatch-section").fadeIn();
        } else {
            $("#dispatch-section").hide();
        }
    }

    // Form Submission
    $("#materialForm").submit(function (e) {
        e.preventDefault();

        const selectedCards = $(".material-card.selected");
        if (selectedCards.length === 0) {
            showNotification("Error", "Please select at least one product.", "error");
            return;
        }

        const warehouse = $("#dispatchWarehouse").val();
        if (!warehouse) {
            showNotification("Error", "Please select a warehouse.", "error");
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

        const newShipmentId = "ORD-" + Math.floor(1000 + Math.random() * 9000);
        const newShipment = {
            id: newShipmentId,
            dispatchDate: new Date().toISOString().split("T")[0],
            warehouse: warehouse,
            items: items,
            grandTotal: $("#grandTotal").text(),
            status: "Pending",
        };

        // Save to localStorage (will be replaced with PHP/DB later)
        let shipments = getFromStorage("shipments", []);
        shipments.unshift(newShipment);
        saveToStorage("shipments", shipments);

        showNotification(
            "Success!",
            `Order ${newShipmentId} submitted to ${warehouse} warehouse successfully!`,
            "success"
        );

        // Reset form
        this.reset();
        $(".material-card").removeClass("selected");
        updateSelectionState();
        renderMaterialGrid();
    });

    console.log("Vendor Material Entry page loaded");
});
