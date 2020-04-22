using System;
using System.Collections.Generic;
using System.Text;

namespace TokenServices
{
    public interface ITokenServiceProvider
    {
        string GenerateToken(TokenPayload payload);
        bool VerifyToken(string token);
        TokenPayload GetPayload(string token);
    }
}
