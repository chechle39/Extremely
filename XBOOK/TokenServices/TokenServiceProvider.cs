using System;
using System.Collections.Generic;
using System.Text;

namespace TokenServices
{
    public abstract class TokenServiceProvider : ITokenServiceProvider
    {
        public string SecretKey { get; set; }

        protected TokenServiceProvider()
        {
            SecretKey = ")8Zx/s9bbC(,mpT(?rDyD[VjWTl:b?8:1A=5Ll`)}(n[NDVUVn1PPmowl=h<V@G";
        }

        public abstract string GenerateToken(TokenPayload payload);

        public abstract bool VerifyToken(string token);

        public abstract TokenPayload GetPayload(string token);
    }
}
