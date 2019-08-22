// On pinned report delete btn click
export default function setupPinningDelete(deletePinnedReportURL) {
    function deleteCallback(e) {
        e.preventDefault();
        let prId = $(this).data('deletePinnedReport');
        let pinnedReport = $(this).closest('.pinned-report');
    
        if (deletePinnedReportURL &&
            window.confirm(gettext('Warning: This action cannot be undone. Are you sure you want to delete this pinned report?'))) {
            $.ajax({
                type: "POST",
                url: deletePinnedReportURL,
                data: {
                    pinned_report_id: prId,
                },
                success: function () {
                    pinnedReport.remove();
                }
            });
        }
    }
    $('[data-delete-pinned-report]').click(deleteCallback);
}
