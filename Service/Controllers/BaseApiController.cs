using Microsoft.AspNetCore.Mvc;
using Service.Helpers;

namespace Service.Controllers;

[ServiceFilter(typeof(LogUserActivity))]
[ApiController]
[Route("api/[controller]")]
public class BaseApiController: ControllerBase
{
    
}