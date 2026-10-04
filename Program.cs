// The site lives in docs/ rather than wwwroot/ so that ONE index.html serves
// both delivery paths: this app (web root = docs) and GitHub Pages (publishing
// folder = /docs). Asset URLs inside the page are relative, so they resolve
// identically either way.
var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    WebRootPath = "docs"
});

builder.Services.AddControllers();

var app = builder.Build();

// Serves docs/css, docs/js and docs/favicon.ico.
app.UseStaticFiles();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
