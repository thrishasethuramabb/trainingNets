namespace trainingnets.Requests
{
    public class Login
    {
        public string username { get; set; }
        public string password { get; set; }
    }
    public class BarcodeLoginRequest
    {
        public string Barcode { get; set; }
    }
}
