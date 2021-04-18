<style>
    .wocommerce-message.error {
        border-left-color: #e23e3e !important;
    }
</style>
<h1><?php echo get_admin_page_title(); ?></h1>
<br>
<form action="#" method="post">
    <label for="trxid" class="form-label">Transaction ID</label>
    <input name="trxid" type="text" id="trxid" placeholder="Transaction ID" class="form-text-input"
           value="<?php echo $trx_id ?? ''; ?>">

    <button class="button button-primary" type="submit">Search</button>
</form>
<br>

<?php
if (isset($trx) && is_string($trx)) {
    // FAILED TO GET BALANCES
    ?>
    <div id="message" class="updated woocommerce-message error">
        <p><?php echo $trx ?? '' ?></p>
    </div>
    <?php

} else if (isset($trx['trxID']) && is_array($trx)) {
    // GOT TRANSACTION
    ?>
    <div class="gateway-banner updated">
        <img style="max-width: 90px; margin: 10px 5px"
             src="<?php echo \bKash\PGW\WC_Gateway_bKash()->plugin_url() . '/assets/images/logo.png'; ?>"/>
        <p class="main">
            <strong>Transaction ID: <?php _e($trx['trxID'] ?? '', 'woocommerce-payment-gateway-bkash'); ?></strong></p>
        <hr>
        <p><?php _e('Sender: <b>' . ($trx['customerMsisdn'] ?? '') . '</b>', 'woocommerce-payment-gateway-bkash'); ?></p>
        <p><?php _e('Amount: <b>' . ($trx['amount'] ?? '') . ' ' . ($trx['currency'] ?? '') . '</b>', 'woocommerce-payment-gateway-bkash'); ?></p>
        <hr>
        <ul>
            <li><?php echo __('Transaction Type', 'woocommerce-payment-gateway-bkash') . ' <strong>' . ($trx['transactionType'] ?? '') . '</strong>'; ?></li>
            <li><?php echo __('Merchant Account', 'woocommerce-payment-gateway-bkash') . ' <strong>' . ($trx['organizationShortCode'] ?? '') . '</strong>'; ?></li>
            <li><?php echo __('Initiated At', 'woocommerce-payment-gateway-bkash') . ' <strong>' . ($trx['initiationTime'] ?? '') . '</strong>'; ?></li>
            <li><?php echo __('Completed At', 'woocommerce-payment-gateway-bkash') . ' <strong>' . ($trx['completedTime'] ?? '') . '</strong>'; ?></li>
        </ul>
        <p>
            <button
                    class="button button-small <?php echo ($trx['transactionStatus'] ?? '') === 'Completed' ? 'button-primary' : 'button'; ?>">
                <?php _e('Transaction Status - ' . ($trx['transactionStatus'] ?? ''), 'woocommerce-payment-gateway-bkash'); ?>
            </button>
        </p>
    </div>
    <?php
}
?>