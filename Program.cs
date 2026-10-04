var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    // The portfolio is public and read-only, so HSTS is the only hardening it needs.
    app.UseHsts();
    app.UseHttpsRedirection();
}

// MapStaticAssets fingerprints and pre-compresses wwwroot assets at build time.
app.MapStaticAssets();

app.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

app.Run();
