/*global using trainingnets.Data;
global using Microsoft.EntityFrameworkCore;
global using System;
global using System.Collections.Generic;
global using System.Linq;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
 using trainingnets.Services;
using Google.Api;
using System.Reflection;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    });


//builder.Services.AddCors(options => options.AddPolicy("EnableCORS", builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));
builder.Services.AddCors(options =>
{
    options.AddPolicy("EnableCORS", builder =>
    {
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
    options.AddPolicy("EnableCORSProd", builder =>
    {
        builder.WithOrigins("http://10.90.104.34:7130").AllowAnyMethod().AllowAnyHeader().AllowCredentials();
    });
});



// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
// Create jwt authentication, Enable Token bearer authentication in Swagger::: reference video https://www.youtube.com/watch?v=y2zjEfuQWuM 
builder.Services.AddSwaggerGen(sw =>
                sw.SwaggerDoc("v1",
                new OpenApiInfo { Title = "trainingnets", Version = "1.0" }));

builder.Services.AddSwaggerGen(s =>
                 s.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                 {
                     In = ParameterLocation.Header,
                     Description = "Insert JWT Token",
                     Name = "Authorization",
                     Type = SecuritySchemeType.Http,
                     BearerFormat = "JWT",
                     Scheme = "bearer"
                 }));

builder.Services.AddSwaggerGen(w =>
                 w.AddSecurityRequirement(
                     new OpenApiSecurityRequirement
                     {
                         {
                             new OpenApiSecurityScheme
                             {
                                 Reference = new OpenApiReference
                                 {
                                     Type = ReferenceType.SecurityScheme,
                                     Id = "Bearer"
                                 }
                             },
                             new string[] {}
                         }
                     }
                     ));

builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseLazyLoadingProxies().UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
   
});

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

}).AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"])),
        ValidateIssuer = false,
        ValidateAudience = false


    };

});

builder.Services.AddSingleton < JwtAuthenticationManager>(new JwtAuthenticationManager(builder.Configuration["Jwt:Key"]));
builder.Services.AddHttpContextAccessor();






var app = builder.Build();

// Apply CORS for all environments, ensuring it's early in the pipeline.
app.UseCors(app.Environment.IsDevelopment() ? "EnableCORS" : "EnableCORSProd");

// Now set up exception handling
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/error");
}

if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

*/
global using trainingnets.Data;
global using Microsoft.EntityFrameworkCore;
global using System;
global using System.Collections.Generic;
global using System.Linq;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using trainingnets.Services;
using Google.Api;
using System.Reflection;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.DependencyInjection;

//CORS N
//var EnableCORS = "_EnableCORS";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddNewtonsoftJson(options =>
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
);


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
// Create jwt authentication, Enable Token bearer authentication in Swagger::: reference video https://www.youtube.com/watch?v=y2zjEfuQWuM 
builder.Services.AddSwaggerGen(sw =>
                sw.SwaggerDoc("v1",
                new OpenApiInfo { Title = "trainingnets", Version = "1.0" }));

builder.Services.AddSwaggerGen(s =>
                 s.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                 {
                     In = ParameterLocation.Header,
                     Description = "Insert JWT Token",
                     Name = "Authorization",
                     Type = SecuritySchemeType.Http,
                     BearerFormat = "JWT",
                     Scheme = "bearer"
                 }));

builder.Services.AddSwaggerGen(w =>
                 w.AddSecurityRequirement(
                     new OpenApiSecurityRequirement
                     {
                         {
                             new OpenApiSecurityScheme
                             {
                                 Reference = new OpenApiReference
                                 {
                                     Type = ReferenceType.SecurityScheme,
                                     Id = "Bearer"
                                 }
                             },
                             new string[] {}
                         }
                     }
                     ));

/*builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseLazyLoadingProxies().UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
   
});*/
builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseLazyLoadingProxies()
           .UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"), sqlServerOptions =>
               sqlServerOptions.EnableRetryOnFailure(
                   maxRetryCount: 5,
                   maxRetryDelay: TimeSpan.FromSeconds(30),
                   errorNumbersToAdd: null));
});

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

}).AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"])),
        ValidateIssuer = false,
        ValidateAudience = false


    };

});

builder.Services.AddSingleton<JwtAuthenticationManager>(new JwtAuthenticationManager(builder.Configuration["Jwt:Key"]));
builder.Services.AddHttpContextAccessor();


builder.Services.AddCors(options =>
{
    options.AddPolicy("EnableCORS", builder =>
    {
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
    options.AddPolicy("EnableCORSProd", builder =>
    {
        builder.WithOrigins("http://10.90.102.173:8085").AllowAnyMethod().AllowAnyHeader().AllowCredentials();
    });
});


/*builder.Services.AddCors(options =>
{
    options.AddPolicy(name: EnableCORS,
                      policy =>
                      {
                          policy.WithOrigins()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                      });
});*/

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/error");

}





app.UseCors("EnableCORSProd");
app.UseCors(policy => policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());


app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();



app.MapControllers();

app.Run();
