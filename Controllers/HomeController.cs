using Microsoft.AspNetCore.Mvc;

namespace PortfolioWebsite.Controllers;

/// <summary>
/// The only controller. The portfolio page is a single static file in docs/ so
/// that GitHub Pages can serve the very same file; this action hands it back
/// through MVC routing, which keeps "/" , "/Home" and "/Home/Index" working.
/// </summary>
public class HomeController(IWebHostEnvironment env) : Controller
{
    public IActionResult Index()
    {
        var page = Path.Combine(env.WebRootPath, "index.html");
        return PhysicalFile(page, "text/html; charset=utf-8");
    }
}
