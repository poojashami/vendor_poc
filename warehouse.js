// Warehouse Acceptance Page JavaScript
$(document).ready(function () {

    // Function to render shipments table
    function renderShipments(filter = "All") {
        const tableBody = $("#shipmentTableBody");
        const emptyMsg = $("#empty-shipment-msg");
        tableBody.empty();

        // Get shipments from localStorage
        let shipments = getFromStorage("shipments", []);

        // Filter by warehouse
        let filteredShipments = shipments;
        if (filter !== "All") {
            filteredShipments = shipments.filter(s => s.warehouse === filter);
        }

        // Only show pending shipments
        filteredShipments = filteredShipments.filter(s => s.status === "Pending");

        if (filteredShipments.length === 0) {
            tableBody.append(`
        <tr>
          <td colspan="7" class="text-center py-4 text-muted">
            No pending shipments found for ${filter === "All" ? "any warehouse" : filter}.
          </td>
        </tr>
      `);
            return;
        }

        filteredShipments.forEach((shipment) => {
            // Create items summary
            let itemSummary = "";
            if (shipment.items && shipment.items.length > 0) {
                if (shipment.items.length === 1) {
                    itemSummary = shipment.items[0].name || "Product";
                } else {
                    itemSummary = `${shipment.items[0].name || 'Product'} + ${shipment.items.length - 1} more`;
                }
            } else {
                itemSummary = "No items";
            }

            const row = `
        <tr>
          <td class="fw-bold font-monospace">${shipment.id}</td>
          <td class="small">${shipment.dispatchDate || 'N/A'}</td>
          <td><span class="badge bg-primary-subtle text-primary border">${shipment.warehouse}</span></td>
          <td class="small text-muted">${itemSummary}</td>
          <td class="fw-bold">${shipment.grandTotal || '₹0.00'}</td>
          <td><span class="badge bg-warning text-dark">${shipment.status}</span></td>
          <td class="text-end">
            <button class="btn btn-sm btn-success rounded-pill px-3" onclick="acceptShipment('${shipment.id}')">
              <i class="fas fa-check me-1"></i> Accept
            </button>
            <button class="btn btn-sm btn-outline-secondary rounded-pill ms-1" onclick="viewShipmentDetails('${shipment.id}')">
              <i class="fas fa-eye"></i>
            </button>
          </td>
        </tr>
      `;
            tableBody.append(row);
        });
    }

    // Accept shipment function
    window.acceptShipment = function (id) {
        let shipments = getFromStorage("shipments", []);
        const shipment = shipments.find(s => s.id === id);

        if (shipment) {
            shipment.status = "Received";
            saveToStorage("shipments", shipments);

            showNotification(
                "Success!",
                `Stock from Order ${shipment.id} has been added to ${shipment.warehouse} inventory.`,
                "success"
            );

            // Re-render with current filter
            const activeFilter = $("#warehouseTabs .nav-link.active").data("filter") || "All";
            renderShipments(activeFilter);
        }
    };

    // View shipment details function
    window.viewShipmentDetails = function (id) {
        let shipments = getFromStorage("shipments", []);
        const shipment = shipments.find(s => s.id === id);

        if (shipment) {
            let itemsHtml = "";
            if (shipment.items && shipment.items.length > 0) {
                shipment.items.forEach(item => {
                    itemsHtml += `
            <tr>
              <td>${item.name}</td>
              <td>${item.qty || 1}</td>
              <td>${item.price || '₹0.00'}</td>
              <td>${item.total || '₹0.00'}</td>
            </tr>
          `;
                });
            }

            Swal.fire({
                title: `Order Details - ${shipment.id}`,
                html: `
          <div class="text-start">
            <p><strong>Warehouse:</strong> ${shipment.warehouse}</p>
            <p><strong>Dispatch Date:</strong> ${shipment.dispatchDate || 'N/A'}</p>
            <p><strong>Status:</strong> <span class="badge bg-warning">${shipment.status}</span></p>
            <p><strong>Total Amount:</strong> ${shipment.grandTotal}</p>
            <hr>
            <h6>Items:</h6>
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>
        `,
                width: 600,
                confirmButtonText: 'Close'
            });
        }
    };

    // Warehouse tab click handler
    $("#warehouseTabs .nav-link").click(function (e) {
        e.preventDefault();
        $("#warehouseTabs .nav-link").removeClass("active");
        $(this).addClass("active");

        const filter = $(this).data("filter");
        renderShipments(filter);
    });

    // Initial render
    renderShipments("All");

    console.log("Warehouse Acceptance page loaded");
});
