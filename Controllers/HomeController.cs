using Microsoft.AspNetCore.Mvc;

namespace PortfolioWebsite.Controllers;

/// <summary>
/// The only controller in the app: the portfolio is a single server-rendered page,
/// so <see cref="Index"/> is the one action and Views/Home/Index.cshtml the one view.
/// </summary>
public class HomeController : Controller
{
    public IActionResult Index() => View();
}
