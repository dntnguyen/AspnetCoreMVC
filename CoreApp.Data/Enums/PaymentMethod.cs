﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace CoreApp.Data.Enums
{
    public enum PaymentMethod
    {
        [Description("Cash on delivery")]
        CashOnDelivery,
        [Description("Online Banking")]
        OnlinBanking,
        [Description("Payment Gateway")]
        PaymentGateway,
        [Description("Visa")]
        Visa,
        [Description("Master Card")]
        MasterCard,
        [Description("PayPal")]
        PayPal,
        [Description("Atm")]
        Atm
    }
}
