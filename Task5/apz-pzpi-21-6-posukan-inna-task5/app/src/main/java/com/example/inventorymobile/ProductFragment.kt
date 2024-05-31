package com.example.inventorymobile

import android.os.AsyncTask
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.ListView
import android.widget.TextView
import androidx.fragment.app.Fragment
import com.example.inventorymobile.Connection.ConnectionClass
import java.sql.Connection
import java.sql.ResultSet
import java.sql.SQLException

class ProductFragment : Fragment() {

    private lateinit var storeId: String
    private lateinit var storeIdTextView: TextView
    private lateinit var productListView: ListView
    private lateinit var productAdapter: ArrayAdapter<Pair<String, Int>>
    private lateinit var connectionClass: ConnectionClass

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        storeId = arguments?.getString("store_id") ?: ""
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_product, container, false)

        storeIdTextView = view.findViewById(R.id.textViewStoreId)
        productListView = view.findViewById(R.id.listViewProducts)

        storeIdTextView.text = storeId

        productAdapter = object : ArrayAdapter<Pair<String, Int>>(requireContext(), R.layout.item_product, R.id.textViewProductName, mutableListOf()) {
            override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
                val view = convertView ?: LayoutInflater.from(context).inflate(R.layout.item_product, parent, false)
                val productNameTextView = view.findViewById<TextView>(R.id.textViewProductName)
                val productQuantityTextView = view.findViewById<TextView>(R.id.textViewProductQuantity)
                val (productName, productQuantity) = getItem(position)!!
                productNameTextView.text = productName
                productQuantityTextView.text = "Quantity: $productQuantity"
                return view
            }
        }
        productListView.adapter = productAdapter

        connectionClass = ConnectionClass()

        FetchProductsTask().execute()

        return view
    }

    private inner class FetchProductsTask : AsyncTask<Void, Void, List<Pair<String, Int>>>() {
        override fun doInBackground(vararg params: Void?): List<Pair<String, Int>> {
            val products = mutableListOf<Pair<String, Int>>()
            val connection: Connection? = connectionClass.connectToSQL()
            try {
                if (connection != null) {
                    val query = """
                        SELECT p.ProductName, sp.quantity 
                        FROM product p 
                        JOIN Store_Products sp ON p.product_id = sp.product_id 
                        WHERE sp.store_id = ?
                    """
                    val preparedStatement = connection.prepareStatement(query)
                    preparedStatement.setString(1, storeId)
                    val resultSet: ResultSet = preparedStatement.executeQuery()
                    while (resultSet.next()) {
                        val productName = resultSet.getString("ProductName")
                        val quantity = resultSet.getInt("quantity")
                        products.add(Pair(productName, quantity))
                    }
                    resultSet.close()
                    preparedStatement.close()
                }
            } catch (e: SQLException) {
                e.printStackTrace()
            } finally {
                connection?.close()
            }
            return products
        }

        override fun onPostExecute(products: List<Pair<String, Int>>) {
            super.onPostExecute(products)
            productAdapter.clear()
            if (products.isNotEmpty()) {
                productAdapter.addAll(products)
            } else {
                productAdapter.add(Pair("No products found", 0))
            }
        }
    }

    companion object {
        @JvmStatic
        fun newInstance(storeId: String) = ProductFragment().apply {
            arguments = Bundle().apply {
                putString("store_id", storeId)
            }
        }
    }
}
