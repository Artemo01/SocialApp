using Microsoft.AspNetCore.Mvc.Filters;
using Service.Extensions;
using Service.Interfaces;

namespace Service.Helpers;

public class LogUserActivity : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var resultContext = await next();
        
        if(context.HttpContext.User.Identity?.IsAuthenticated != true) return;

        var userId = context.HttpContext.User.GetUserId();
        
        var unitOfWork = resultContext.HttpContext.RequestServices.GetRequiredService<IUnitOfWork>();
        var user = await unitOfWork.UserRepository.GetUserByIdAsync(userId);
        if(user == null) return;
        user.LastActive = DateTime.UtcNow;
        await unitOfWork.Complete();
    }
}