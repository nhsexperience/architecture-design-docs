using Microsoft.AspNetCore.Mvc;
using dhc;
using Swashbuckle.AspNetCore.Annotations;

namespace dhcapi.Controllers;

[ApiController]
[ApiVersion("0.1")]
[Route("/v{version:apiVersion}/[controller]")]
public class HealthCheckController : ControllerBase
{
    private readonly ILogger<HealthCheckController> _logger;
    private readonly  IHealthCheckProvider _healthCheckProvider;
    private readonly IHealthCheckRequestDataConverterProvider _hcConverterProvider;
    public HealthCheckController(
        ILogger<HealthCheckController> logger,
        IHealthCheckProvider healthCheckProvider,
        IHealthCheckRequestDataConverterProvider hcConverterProvider)
    {
        _logger = logger;
        _healthCheckProvider = healthCheckProvider;
        _hcConverterProvider = hcConverterProvider;
    }

    [Consumes("application/json")]
    [Produces("application/json")]
    [HttpPost(Name = "GetHealthCheck"), MapToApiVersion("0.1")]
    public HealthCheckResult Get(
          [FromBody]HealthCheckRequestData data)
    {
        var healthCheckData = _hcConverterProvider.CovertToDhcHealthCheckData(data);
        return _healthCheckProvider.Calculate(healthCheckData);
    }
}
