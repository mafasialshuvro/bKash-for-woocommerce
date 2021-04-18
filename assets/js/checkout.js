jQuery(function ($) {
    $('form.woocommerce-checkout').on('click', "#place_order", function (event) {
        event.preventDefault();
        InitiatebKashPayment();
    });

    function InitiatebKashPayment() {
        var button = document.createElement("button");
        button.id = "bKash_button";
        button.disabled = false;
        button.style.display = "hidden";

        var body = document.getElementsByTagName("body")[0];
        body.appendChild(button);

        var paymentObj = {paymentID: "", orderID: ""}

        if (bKash !== undefined) {
            bKash.init({
                paymentMode: 'checkout',
                paymentRequest: {amount: '100.50', intent: 'sale'},

                createRequest: function (request) {
                    $.blockUI({message: ''});
                    var post_data = $('form.checkout').serialize()
                    post_data['action'] = 'ajax_order';
                    $.ajax({
                        type: 'POST',
                        url: bKash_objects.submit_order,
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        enctype: 'multipart/form-data',
                        data: post_data,
                        success: function (result) {
                            if (result.result && result.result === 'success') {
                                paymentObj = result.order;
                                bKash.create().onSuccess(result.response);
                            } else {
                                bKash.execute().onError();
                                submit_error(result.messages)
                            }
                            $.unblockUI();
                        },
                        error: function (error) {
                            $.unblockUI();
                            bKash.execute().onError();
                            submit_error(error)
                        }
                    });

                },
                executeRequestOnAuthorization: function () {

                    $.blockUI({message: ''});
                    $.ajax({
                        type: 'POST',
                        url: bKash_objects.wcAjaxURL,
                        dataType: "json",
                        data: {
                            action: 'bk_execute',
                            security: $('#bkash-ajax-nonce').val(),
                            'orderId': paymentObj.orderId,
                            'paymentID': paymentObj.paymentID,
                            'invoiceID': paymentObj.invoiceID,
                            'status': 'success',
                            'apiVersion': 'v1.2.0-beta'
                        },
                        success: function (resp) {
                            console.log(resp);
                            if (resp.result && resp.result === 'success') {
                                if (resp.redirect) {
                                    window.location.href = resp.redirect;
                                }
                            } else {
                                submit_error(resp.messages);
                                bKash.execute().onError();
                            }
                            $.unblockUI();
                        },
                        error: function (error) {
                            $.unblockUI();
                            submit_error(error)
                            bKash.execute().onError();
                        }
                    });
                },
                onClose: function () {
                    submit_error("You have chosen to cancel the payment");
                }
            });

            button.click();


        } else {
            console.log("bKash SDK is not set properly!");
        }
    }


    function submit_error(error_message, group = "error") {
        var checkout_form = $('form.checkout');
        $('.woocommerce-NoticeGroup-checkout, .woocommerce-error, .woocommerce-message').remove();
        checkout_form.prepend('<div class="woocommerce-' + group + ' woocommerce-NoticeGroup-checkout">' + error_message + '</div>'); // eslint-disable-line max-len
        checkout_form.removeClass('processing').unblock();
        checkout_form.find('.input-text, select, input:checkbox').trigger('validate').blur();
        scroll_to_notices();
        $(document.body).trigger('checkout_error', [error_message]);
    }

    function scroll_to_notices() {
        var scrollElement = $('.woocommerce-NoticeGroup-updateOrderReview, .woocommerce-NoticeGroup-checkout');

        if (!scrollElement.length) {
            scrollElement = $('.form.checkout');
        }
        $.scroll_to_notices(scrollElement);
    }
});


