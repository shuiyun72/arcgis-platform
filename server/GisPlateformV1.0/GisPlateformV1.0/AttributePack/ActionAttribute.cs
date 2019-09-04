﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GisPlateformV1_0.AttributePack
{
    [AttributeUsage(AttributeTargets.Method, Inherited = true)]
    public class ActionAttribute: Attribute
    {
        public bool IsCheckAuthority = true;
    }
}