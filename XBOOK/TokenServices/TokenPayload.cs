using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace TokenServices
{
    public class TokenPayload
    {
        [JsonProperty(PropertyName = "exp")]
        [JsonConverter(typeof(UnixTimestampJsonConverter))]
        public DateTime ExpireDate { get; set; }

        [JsonProperty(PropertyName = "iat")]
        [JsonConverter(typeof(UnixTimestampJsonConverter))]
        public DateTime? IssuedAt { get; set; }

        [JsonProperty(PropertyName = "iss")]
        public string Issuer { get; set; }

        [JsonProperty(PropertyName = "user")]
        public string User { get; set; }

        [JsonProperty("udn")]
        public string UserDisplayName { get; set; }

        [JsonProperty(PropertyName = "aud")]
        public string Audience { get; set; }

        [JsonProperty(PropertyName = "sub")]
        public string Subject { get; set; }

        [JsonProperty(PropertyName = "udata")]
        public string[] UserData { get; set; }
    }

    public class UnixTimestampJsonConverter : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            DateTime date = Convert.ToDateTime(value);
            writer.WriteValue((long)(date - new DateTime(1970, 1, 1)).TotalSeconds);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            DateTime date = new DateTime(1970, 1, 1).AddSeconds((long)reader.Value);
            return date;
        }

        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(DateTime);
        }
    }
}
