using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace TokenServices
{
    public class JwtTokenServiceProvider : TokenServiceProvider
    {
        public override string GenerateToken(TokenPayload payload)
        {
            var jsonPayload = JsonConvert.SerializeObject(payload, new JsonSerializerSettings()
            {
                NullValueHandling = NullValueHandling.Ignore
            });

            byte[] payloadBytes = Encoding.UTF8.GetBytes(jsonPayload);
            string payloadBase64 = Convert.ToBase64String(payloadBytes);
            string signature = GenerateSignature(payloadBase64);

            return $"{payloadBase64}.{signature}";
        }

        public override bool VerifyToken(string token)
        {
            if (string.IsNullOrEmpty(token))
                return false;

            string[] tokenParts = token.Split(new[] { "." }, StringSplitOptions.RemoveEmptyEntries);
            if (tokenParts.Length != 2)
                return false;

            string signature = GenerateSignature(tokenParts[0]);
            bool isSignatureValid = signature.Equals(tokenParts[1], StringComparison.InvariantCultureIgnoreCase);

            var tokenPayload = GetObjectFromBase64String<TokenPayload>(tokenParts[0]);

            return isSignatureValid && tokenPayload != null && DateTime.Now <= tokenPayload.ExpireDate;
        }

        public override TokenPayload GetPayload(string token)
        {
            if (string.IsNullOrEmpty(token))
                return null;

            try
            {
                string[] tokenParts = token.Split(new[] { "." }, StringSplitOptions.RemoveEmptyEntries);
                return GetObjectFromBase64String<TokenPayload>(tokenParts[0]);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public string GenerateSignature(string payload)
        {
            var key = Encoding.UTF8.GetBytes(SecretKey);
            var hash = new HMACSHA256(key);

            byte[] signatureData = hash.ComputeHash(Encoding.UTF8.GetBytes(payload));
            return Convert.ToBase64String(signatureData);
        }

        private TObject GetObjectFromBase64String<TObject>(string base64String)
        {
            byte[] stringData = Convert.FromBase64String(base64String);
            string data = Encoding.UTF8.GetString(stringData);

            return JsonConvert.DeserializeObject<TObject>(data);
        }
    }
}
