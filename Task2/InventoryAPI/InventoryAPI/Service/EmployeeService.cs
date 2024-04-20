﻿using InventoryAPI.Models;
using InventoryAPI.Data;
using Microsoft.EntityFrameworkCore;


namespace InventoryAPI.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly InventoryContext _context;

        public EmployeeService(InventoryContext context)
        {
            _context = context;
        }

        public async Task<Employee> AddEmployee(Employee employee)
        {
            if (employee == null)
            {
                throw new ArgumentNullException(nameof(employee));
            }

            try
            {
                _context.Employees.Add(employee);
                await _context.SaveChangesAsync();
                return employee;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error adding employee: {ex.Message}");
            }
        }

        public async Task<bool> DeleteEmployee(int id)
        {
            try
            {
                var employee = await _context.Employees.FindAsync(id);
                if (employee == null)
                {
                    return false; 
                }

                _context.Employees.Remove(employee);
                await _context.SaveChangesAsync();

                return true; 
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deleting employee: {ex.Message}");
            }
        }

        public async Task<IEnumerable<Store>> GetStoresByEmployeeId(int id)
        {
            try
            {
                var stores = await _context.Stores
                    .Where(s => s.Employees.Any(e => e.EmployeeId == id))
                    .ToListAsync();

                return stores;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving stores: {ex.Message}");
            }
        }

        public async Task<Employee> UpdateEmployee(int id, Employee employeeData)
        {
            if (employeeData == null)
            {
                throw new ArgumentNullException(nameof(employeeData));
            }

            try
            {
                var employee = await _context.Employees.FindAsync(id);
                if (employee == null)
                {
                    return null; 
                }

                employee.FirstName = employeeData.FirstName;
                employee.LastName = employeeData.LastName;
                employee.Email = employeeData.Email;
                employee.Position = employeeData.Position;
                employee.StoreId = employeeData.StoreId;

                await _context.SaveChangesAsync();

                return employee;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating employee: {ex.Message}");
            }
        }
    }
}
