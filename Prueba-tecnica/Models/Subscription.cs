using System.Text.Json.Serialization;

public class Subscription
{
    [JsonIgnore]
    public int Id { get; set; }
    public int SubscriberId { get; set; }
    public int ResearcherId { get; set; }
}
