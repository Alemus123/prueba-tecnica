using System.Text.Json.Serialization;
public class Journals
{
    [JsonIgnore]
    public int Id { get; set; }
    public string Title { get; set; }
    public string Author { get; set; }
    public DateTime PublicationDate { get; set; }
    public string FilePath { get; set; }

}
