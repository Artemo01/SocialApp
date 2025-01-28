using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Service.Data.Migrations
{
    /// <inheritdoc />
    public partial class TypoCorrection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Introductrion",
                table: "Users",
                newName: "Introduction");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Introduction",
                table: "Users",
                newName: "Introductrion");
        }
    }
}
