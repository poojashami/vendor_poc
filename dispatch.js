// Dispatch Material Page JavaScript
$(document).ready(function () {

    // Dispatched History Array
    let dispatchedHistory = getFromStorage("dispatchedHistory", []);

    // Function to render pending dispatch list
    function renderPendingDispatchList(filter = "All") {
        const tableBody = $("#dispatchTableBody");
        const countBadge = $("#pendingDispatchCount");
        tableBody.empty();

        // Get pending dispatch orders from localStorage
        let pendingDispatchOrders = getFromStorage("pendingDispatchOrders", []);

        // Always show total pending count in the badge
        countBadge.text(pendingDispatchOrders.length);

        const mainRow = $("#dispatchMainRow");
        const allClear = $("#dispatchAllClear");

        if (pendingDispatchOrders.length === 0) {
            mainRow.hide();
            allClear.show();
            return;
        } else {
            mainRow.show();
            allClear.hide();
        }

        const filteredOrders = pendingDispatchOrders.filter(order => {
            if (filter === "All") return true;
            return order.destination === filter;
        });

        if (filteredOrders.length === 0) {
            tableBody.append(`
        <tr>
          <td colspan="7" class="text-center py-5 text-muted">
            <i class="fas fa-search mb-2 fs-3 opacity-25"></i>
            <p class="mb-0">No orders found for ${filter}</p>
          </td>
        </tr>
      `);
            return;
        }

        filteredOrders.forEach((order) => {
            const itemSummary = order.items.length > 1
                ? `${order.items[0].name || 'Product'} + ${order.items.length - 1} more`
                : (order.items[0].name || 'Product');

            tableBody.append(`
        <tr>
          <td class="ps-3"><span class="badge bg-secondary-subtle text-secondary font-monospace border">${order.id}</span></td>
          <td class="small">${order.date || 'Jan 15, 2026'}</td>
          <td class="small fw-bold">${order.retailer || 'General Seller'}</td>
          <td class="small"><i class="fas fa-map-marker-alt me-1 text-danger opacity-75"></i> ${order.destination}</td>
          <td class="small text-muted">${itemSummary}</td>
          <td class="fw-bold text-dark">€${order.amount.toFixed(2)}</td>
          <td class="text-end pe-3">
            <button class="btn btn-sm btn-primary px-3 rounded-pill" onclick="finalizeDispatch(this, '${order.id}')">
              <i class="fas fa-paper-plane me-1"></i> Dispatch
            </button>
          </td>
        </tr>
      `);
        });
    }

    // Finalize dispatch function
    window.finalizeDispatch = function (btn, orderId) {
        let pendingDispatchOrders = getFromStorage("pendingDispatchOrders", []);
        const orderIdx = pendingDispatchOrders.findIndex((o) => o.id === orderId);

        if (orderIdx === -1) return;

        // Immediately disable button and show loading state
        $(btn).prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-1"></i> Processing...');

        const order = pendingDispatchOrders[orderIdx];
        const dispatchId = "DSP-" + Math.floor(1000 + Math.random() * 9000);

        // Move to History
        dispatchedHistory.unshift({
            id: dispatchId,
            orderId: orderId,
            retailer: order.retailer || 'General Seller',
            destination: order.destination,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: "Dispatched",
        });

        // Save to localStorage
        saveToStorage("dispatchedHistory", dispatchedHistory);

        renderDispatchedHistory();

        // Success notification
        showNotification(
            'Order Dispatched',
            `Order ${orderId} has been successfully dispatched!\nDispatch ID: ${dispatchId}`,
            'success'
        );

        // Remove from pending
        pendingDispatchOrders.splice(orderIdx, 1);
        saveToStorage("pendingDispatchOrders", pendingDispatchOrders);

        // Refresh with current filter
        const activeFilter = $("#dispatchFilters .nav-link.active").data("dispatch-filter");
        renderPendingDispatchList(activeFilter);
    };

    // Dispatch Filter Tab Click Handler
    $("#dispatchFilters .nav-link").click(function (e) {
        e.preventDefault();
        $("#dispatchFilters .nav-link").removeClass("active");
        $(this).addClass("active");

        const filter = $(this).data("dispatch-filter");
        renderPendingDispatchList(filter);
    });

    // Render dispatched history
    window.renderDispatchedHistory = function () {
        const body = $("#dispatchedHistoryBody");
        body.empty();

        if (dispatchedHistory.length === 0) {
            body.append(`
        <tr>
          <td colspan="7" class="text-center py-4 text-muted small">
            No dispatched records found.
          </td>
        </tr>
      `);
            return;
        }

        dispatchedHistory.forEach((record) => {
            body.append(`
        <tr>
          <td class="ps-4 fw-bold font-monospace text-primary">${record.id}</td>
          <td class="small fw-bold">${record.orderId}</td>
          <td class="small">${record.retailer}</td>
          <td><span class="badge bg-light text-dark border">${record.destination}</span></td>
          <td class="small">${record.date}</td>
          <td class="text-end pe-4">
            <span class="badge bg-primary rounded-pill px-3 py-2 small fw-medium">
              <i class="fas fa-truck me-1"></i> ${record.status}
            </span>
          </td>
        </tr>
      `);
        });
    };

    // Seed with one mock order for demo (if no orders exist)
    let pendingDispatchOrders = getFromStorage("pendingDispatchOrders", []);
    if (pendingDispatchOrders.length === 0) {
        pendingDispatchOrders.push({
            id: "ORD-8821",
            destination: "Madrid",
            amount: 1450.0,
            items: [{ name: "Cotton Kurti" }, { name: "Silk Sari" }],
            date: "2026-01-14",
            retailer: "Seller 1"
        });
        saveToStorage("pendingDispatchOrders", pendingDispatchOrders);
    }

    // Initial render
    renderPendingDispatchList("All");
    renderDispatchedHistory();

    console.log("Dispatch Material page loaded");
});
