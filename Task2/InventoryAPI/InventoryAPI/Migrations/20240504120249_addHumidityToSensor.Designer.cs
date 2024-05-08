﻿// <auto-generated />
using System;
using InventoryAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace InventoryAPI.Migrations
{
    [DbContext(typeof(InventoryContext))]
    [Migration("20240504120249_addHumidityToSensor")]
    partial class addHumidityToSensor
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("InventoryAPI.Models.Category", b =>
                {
                    b.Property<int>("CategoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("category_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CategoryId"), 1L, 1);

                    b.Property<string>("CategoryName")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("CategoryId");

                    b.ToTable("Category", (string)null);
                });

            modelBuilder.Entity("InventoryAPI.Models.DefectiveProduct", b =>
                {
                    b.Property<int>("DefectiveProductId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("defective_product_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("DefectiveProductId"), 1L, 1);

                    b.Property<DateTime?>("DateDetected")
                        .HasColumnType("date");

                    b.Property<int?>("ProductId")
                        .HasColumnType("int")
                        .HasColumnName("product_id");

                    b.Property<string>("Reason")
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.HasKey("DefectiveProductId");

                    b.HasIndex("ProductId");

                    b.ToTable("Defective_Products", (string)null);
                });

            modelBuilder.Entity("InventoryAPI.Models.Employee", b =>
                {
                    b.Property<int>("EmployeeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("employee_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("EmployeeId"), 1L, 1);

                    b.Property<string>("Email")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("FirstName")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("LastName")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Password")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Position")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<int?>("StoreId")
                        .HasColumnType("int")
                        .HasColumnName("store_id");

                    b.HasKey("EmployeeId");

                    b.HasIndex("StoreId");

                    b.ToTable("Employee", (string)null);
                });

            modelBuilder.Entity("InventoryAPI.Models.Product", b =>
                {
                    b.Property<int>("ProductId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("product_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ProductId"), 1L, 1);

                    b.Property<int?>("CategoryId")
                        .HasColumnType("int")
                        .HasColumnName("category_id");

                    b.Property<string>("Currency")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("ExpiryDate")
                        .HasColumnType("datetime2");

                    b.Property<bool?>("IsFresh")
                        .HasColumnType("bit");

                    b.Property<string>("MeasureOfUnits")
                        .HasColumnType("nvarchar(max)");

                    b.Property<decimal?>("Price")
                        .HasColumnType("decimal(10,2)");

                    b.Property<string>("ProductName")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<int?>("SupplierId")
                        .HasColumnType("int")
                        .HasColumnName("supplier_id");

                    b.Property<decimal?>("Volume")
                        .HasColumnType("decimal(18,2)");

                    b.HasKey("ProductId");

                    b.HasIndex("CategoryId");

                    b.HasIndex("SupplierId");

                    b.ToTable("Product", (string)null);
                });

            modelBuilder.Entity("InventoryAPI.Models.Sale", b =>
                {
                    b.Property<int>("SaleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("sale_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("SaleId"), 1L, 1);

                    b.Property<int?>("EmployeeId")
                        .HasColumnType("int")
                        .HasColumnName("Employee_ID");

                    b.Property<DateTime?>("SaleDate")
                        .HasColumnType("datetime");

                    b.Property<int?>("StoreId")
                        .HasColumnType("int")
                        .HasColumnName("Store_ID");

                    b.HasKey("SaleId");

                    b.HasIndex("EmployeeId");

                    b.HasIndex("StoreId");

                    b.ToTable("Sale", (string)null);
                });

            modelBuilder.Entity("InventoryAPI.Models.SaleItem", b =>
                {
                    b.Property<int>("SaleItemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("sale_item_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("SaleItemId"), 1L, 1);

                    b.Property<decimal?>("Price")
                        .HasColumnType("decimal(10,2)");

                    b.Property<int?>("ProductId")
                        .HasColumnType("int")
                        .HasColumnName("Product_ID");

                    b.Property<int?>("Quantity")
                        .HasColumnType("int");

                    b.Property<int?>("SaleId")
                        .HasColumnType("int")
                        .HasColumnName("Sale_ID");

                    b.HasKey("SaleItemId");

                    b.HasIndex("ProductId");

                    b.HasIndex("SaleId");

                    b.ToTable("Sale_Items", (string)null);
                });

            modelBuilder.Entity("InventoryAPI.Models.Sensor", b =>
                {
                    b.Property<int>("SensorId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("sensor_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("SensorId"), 1L, 1);

                    b.Property<decimal?>("Humidity")
                        .HasColumnType("decimal(18,2)");

                    b.Property<int?>("StoreId")
                        .HasColumnType("int")
                        .HasColumnName("Store_ID");

                    b.Property<decimal?>("Temperature")
                        .HasColumnType("decimal(5,2)");

                    b.Property<DateTime?>("Timestamp")
                        .HasColumnType("datetime");

                    b.HasKey("SensorId");

                    b.HasIndex("StoreId");

                    b.ToTable("Sensor", (string)null);
                });

            modelBuilder.Entity("InventoryAPI.Models.Store", b =>
                {
                    b.Property<int>("StoreId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("store_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("StoreId"), 1L, 1);

                    b.Property<string>("Address")
                        .HasMaxLength(200)
                        .IsUnicode(false)
                        .HasColumnType("varchar(200)");

                    b.Property<string>("StoreName")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<int?>("UserId")
                        .HasColumnType("int")
                        .HasColumnName("user_id");

                    b.HasKey("StoreId");

                    b.HasIndex("UserId");

                    b.ToTable("Store", (string)null);
                });

            modelBuilder.Entity("InventoryAPI.Models.StoreProduct", b =>
                {
                    b.Property<int>("StoreProductId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("store_product_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("StoreProductId"), 1L, 1);

                    b.Property<int?>("MinQuantity")
                        .HasColumnType("int");

                    b.Property<int?>("ProductId")
                        .HasColumnType("int")
                        .HasColumnName("product_id");

                    b.Property<int?>("Quantity")
                        .HasColumnType("int");

                    b.Property<int?>("StoreId")
                        .HasColumnType("int")
                        .HasColumnName("store_id");

                    b.HasKey("StoreProductId");

                    b.HasIndex("ProductId");

                    b.HasIndex("StoreId");

                    b.ToTable("Store_Products", (string)null);
                });

            modelBuilder.Entity("InventoryAPI.Models.Subscription", b =>
                {
                    b.Property<int>("SubscriptionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("subscription_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("SubscriptionId"), 1L, 1);

                    b.Property<DateTime?>("EndDate")
                        .HasColumnType("date");

                    b.Property<DateTime?>("StartDate")
                        .HasColumnType("date");

                    b.Property<string>("SubscriptionStatus")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<int?>("SubscriptionTypeId")
                        .HasColumnType("int")
                        .HasColumnName("SubscriptionType_ID");

                    b.Property<int?>("UserId")
                        .HasColumnType("int")
                        .HasColumnName("user_id");

                    b.HasKey("SubscriptionId");

                    b.HasIndex("SubscriptionTypeId");

                    b.HasIndex("UserId");

                    b.ToTable("Subscription", (string)null);
                });

            modelBuilder.Entity("InventoryAPI.Models.SubscriptionType", b =>
                {
                    b.Property<int>("SubscriptionTypeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("subscription_type_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("SubscriptionTypeId"), 1L, 1);

                    b.Property<string>("Description")
                        .HasMaxLength(200)
                        .IsUnicode(false)
                        .HasColumnType("varchar(200)");

                    b.Property<string>("Name")
                        .HasMaxLength(100)
                        .IsUnicode(false)
                        .HasColumnType("varchar(100)");

                    b.Property<decimal?>("Price")
                        .HasColumnType("decimal(10,2)");

                    b.HasKey("SubscriptionTypeId");

                    b.ToTable("SubscriptionType", (string)null);
                });

            modelBuilder.Entity("InventoryAPI.Models.Supplier", b =>
                {
                    b.Property<int>("SupplierId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("supplier_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("SupplierId"), 1L, 1);

                    b.Property<string>("Address")
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.Property<string>("PhoneNumber")
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.HasKey("SupplierId");

                    b.ToTable("Supplier", (string)null);
                });

            modelBuilder.Entity("InventoryAPI.Models.SupplierRequest", b =>
                {
                    b.Property<int>("RequestId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("request_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RequestId"), 1L, 1);

                    b.Property<DateTime?>("DeliveryDate")
                        .HasColumnType("datetime2");

                    b.Property<int?>("Quantity")
                        .HasColumnType("int");

                    b.Property<DateTime?>("RequestDate")
                        .HasColumnType("datetime");

                    b.Property<string>("RequestStatus")
                        .HasMaxLength(50)
                        .IsUnicode(false)
                        .HasColumnType("varchar(50)");

                    b.Property<int?>("StoreProductId")
                        .HasColumnType("int")
                        .HasColumnName("store_product_id");

                    b.Property<decimal?>("TotalAmount")
                        .HasColumnType("decimal(10,2)");

                    b.HasKey("RequestId")
                        .HasName("PK__Supplier__18D3B90F48696F5B");

                    b.HasIndex("StoreProductId");

                    b.ToTable("SupplierRequest", (string)null);
                });

            modelBuilder.Entity("InventoryAPI.Models.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("user_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("UserId"), 1L, 1);

                    b.Property<string>("Email")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("FirstName")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("LastName")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Password")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("PhoneNumber")
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.Property<string>("Role")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)")
                        .HasColumnName("role");

                    b.HasKey("UserId");

                    b.ToTable("User", (string)null);
                });

            modelBuilder.Entity("InventoryAPI.Models.DefectiveProduct", b =>
                {
                    b.HasOne("InventoryAPI.Models.Product", "Product")
                        .WithMany("DefectiveProducts")
                        .HasForeignKey("ProductId")
                        .HasConstraintName("FK__Defective__produ__52593CB8");

                    b.Navigation("Product");
                });

            modelBuilder.Entity("InventoryAPI.Models.Employee", b =>
                {
                    b.HasOne("InventoryAPI.Models.Store", "Store")
                        .WithMany("Employees")
                        .HasForeignKey("StoreId")
                        .HasConstraintName("FK__Employee__store___3C69FB99");

                    b.Navigation("Store");
                });

            modelBuilder.Entity("InventoryAPI.Models.Product", b =>
                {
                    b.HasOne("InventoryAPI.Models.Category", "Category")
                        .WithMany("Products")
                        .HasForeignKey("CategoryId")
                        .HasConstraintName("FK__Product__categor__4316F928");

                    b.HasOne("InventoryAPI.Models.Supplier", "Supplier")
                        .WithMany("Products")
                        .HasForeignKey("SupplierId")
                        .HasConstraintName("FK__Product__supplie__440B1D61");

                    b.Navigation("Category");

                    b.Navigation("Supplier");
                });

            modelBuilder.Entity("InventoryAPI.Models.Sale", b =>
                {
                    b.HasOne("InventoryAPI.Models.Employee", "Employee")
                        .WithMany("Sales")
                        .HasForeignKey("EmployeeId")
                        .HasConstraintName("FK__Sale__Employee_I__46E78A0C");

                    b.HasOne("InventoryAPI.Models.Store", "Store")
                        .WithMany("Sales")
                        .HasForeignKey("StoreId")
                        .HasConstraintName("FK__Sale__Store_ID__47DBAE45");

                    b.Navigation("Employee");

                    b.Navigation("Store");
                });

            modelBuilder.Entity("InventoryAPI.Models.SaleItem", b =>
                {
                    b.HasOne("InventoryAPI.Models.Product", "Product")
                        .WithMany("SaleItems")
                        .HasForeignKey("ProductId")
                        .HasConstraintName("FK__Sale_Item__Produ__4BAC3F29");

                    b.HasOne("InventoryAPI.Models.Sale", "Sale")
                        .WithMany("SaleItems")
                        .HasForeignKey("SaleId")
                        .HasConstraintName("FK__Sale_Item__Sale___4AB81AF0");

                    b.Navigation("Product");

                    b.Navigation("Sale");
                });

            modelBuilder.Entity("InventoryAPI.Models.Sensor", b =>
                {
                    b.HasOne("InventoryAPI.Models.Store", "Store")
                        .WithMany("Sensors")
                        .HasForeignKey("StoreId")
                        .HasConstraintName("FK__Sensor__Store_ID__5DCAEF64");

                    b.Navigation("Store");
                });

            modelBuilder.Entity("InventoryAPI.Models.Store", b =>
                {
                    b.HasOne("InventoryAPI.Models.User", "User")
                        .WithMany("Stores")
                        .HasForeignKey("UserId")
                        .HasConstraintName("FK__Store__user_id__398D8EEE");

                    b.Navigation("User");
                });

            modelBuilder.Entity("InventoryAPI.Models.StoreProduct", b =>
                {
                    b.HasOne("InventoryAPI.Models.Product", "Product")
                        .WithMany("StoreProducts")
                        .HasForeignKey("ProductId")
                        .HasConstraintName("FK__Store_Pro__produ__4F7CD00D");

                    b.HasOne("InventoryAPI.Models.Store", "Store")
                        .WithMany("StoreProducts")
                        .HasForeignKey("StoreId")
                        .HasConstraintName("FK__Store_Pro__store__4E88ABD4");

                    b.Navigation("Product");

                    b.Navigation("Store");
                });

            modelBuilder.Entity("InventoryAPI.Models.Subscription", b =>
                {
                    b.HasOne("InventoryAPI.Models.SubscriptionType", "SubscriptionType")
                        .WithMany("Subscriptions")
                        .HasForeignKey("SubscriptionTypeId")
                        .HasConstraintName("FK__Subscript__Subsc__59FA5E80");

                    b.HasOne("InventoryAPI.Models.User", "User")
                        .WithMany("Subscriptions")
                        .HasForeignKey("UserId")
                        .HasConstraintName("FK__Subscript__user___5AEE82B9");

                    b.Navigation("SubscriptionType");

                    b.Navigation("User");
                });

            modelBuilder.Entity("InventoryAPI.Models.SupplierRequest", b =>
                {
                    b.HasOne("InventoryAPI.Models.StoreProduct", "StoreProduct")
                        .WithMany("SupplierRequests")
                        .HasForeignKey("StoreProductId")
                        .HasConstraintName("FK__SupplierR__store__5535A963");

                    b.Navigation("StoreProduct");
                });

            modelBuilder.Entity("InventoryAPI.Models.Category", b =>
                {
                    b.Navigation("Products");
                });

            modelBuilder.Entity("InventoryAPI.Models.Employee", b =>
                {
                    b.Navigation("Sales");
                });

            modelBuilder.Entity("InventoryAPI.Models.Product", b =>
                {
                    b.Navigation("DefectiveProducts");

                    b.Navigation("SaleItems");

                    b.Navigation("StoreProducts");
                });

            modelBuilder.Entity("InventoryAPI.Models.Sale", b =>
                {
                    b.Navigation("SaleItems");
                });

            modelBuilder.Entity("InventoryAPI.Models.Store", b =>
                {
                    b.Navigation("Employees");

                    b.Navigation("Sales");

                    b.Navigation("Sensors");

                    b.Navigation("StoreProducts");
                });

            modelBuilder.Entity("InventoryAPI.Models.StoreProduct", b =>
                {
                    b.Navigation("SupplierRequests");
                });

            modelBuilder.Entity("InventoryAPI.Models.SubscriptionType", b =>
                {
                    b.Navigation("Subscriptions");
                });

            modelBuilder.Entity("InventoryAPI.Models.Supplier", b =>
                {
                    b.Navigation("Products");
                });

            modelBuilder.Entity("InventoryAPI.Models.User", b =>
                {
                    b.Navigation("Stores");

                    b.Navigation("Subscriptions");
                });
#pragma warning restore 612, 618
        }
    }
}