package com.example.inventorymobile

import android.content.Context
import android.content.SharedPreferences
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
import com.example.inventorymobile.Data.RequestData
import java.sql.Connection
import java.sql.ResultSet
import java.sql.SQLException

class RequestFragment : Fragment() {

    private lateinit var requestListView: ListView
    private lateinit var requestAdapter: ArrayAdapter<RequestData>
    private lateinit var connectionClass: ConnectionClass
    private lateinit var sharedPreferences: SharedPreferences

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_request, container, false)

        requestListView = view.findViewById(R.id.listViewRequests)

        requestAdapter = object : ArrayAdapter<RequestData>(
            requireContext(),
            android.R.layout.simple_list_item_1,
            android.R.id.text1,
            mutableListOf()
        ) {
            override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
                val view = convertView ?: LayoutInflater.from(context).inflate(android.R.layout.simple_list_item_1, parent, false)
                val textView = view.findViewById<TextView>(android.R.id.text1)
                val requestData = getItem(position)!!
                textView.text = "Product Name: ${requestData.productName}, Quantity: ${requestData.quantity}, Status: ${requestData.requestStatus}, RequestDate: ${requestData.requestDate}, RequestDate: ${requestData.deliveryDate},"
                return view
            }
        }
        requestListView.adapter = requestAdapter

        connectionClass = ConnectionClass()

        sharedPreferences = requireActivity().getSharedPreferences("UserPreferences", Context.MODE_PRIVATE)

        println("User ID: ${getUserIdFromPrefs()}")

        FetchRequestsTask().execute()

        return view
    }


    private fun getUserIdFromPrefs(): Int {
        return sharedPreferences.getInt("user_id", -1)
    }

    private inner class FetchRequestsTask : AsyncTask<Void, Void, List<RequestData>>() {
        override fun doInBackground(vararg params: Void?): List<RequestData> {
            val requests = mutableListOf<RequestData>()
            var connection: Connection? = null
            try {
                connection = connectionClass.connectToSQL()
                if (connection != null) {
                    val query = """
                        SELECT sr.request_id, sr.Quantity, sr.RequestStatus, sr.RequestDate, sr.DeliveryDate, sr.TotalAmount, p.ProductName
                        FROM SupplierRequest sr
                        INNER JOIN store_products sp ON sr.store_product_id = sp.store_product_id
                        INNER JOIN product p ON sp.product_id = p.product_id
                        INNER JOIN store shp ON sp.store_id = shp.store_id
                        WHERE shp.user_id = ?
                    """
                    val preparedStatement = connection.prepareStatement(query)
                    preparedStatement.setInt(1, getUserIdFromPrefs())
                    val resultSet: ResultSet = preparedStatement.executeQuery()

                    while (resultSet.next()) {
                        val requestId = resultSet.getInt("request_id")
                        val productName = resultSet.getString("ProductName")
                        val quantity = resultSet.getInt("Quantity")
                        val requestStatus = resultSet.getString("RequestStatus")
                        val requestDate = resultSet.getDate("RequestDate")
                        val deliveryDate = resultSet.getDate("DeliveryDate")
                        val totalAmount = resultSet.getDouble("TotalAmount")

                        val requestData = RequestData(requestId, productName, quantity, requestStatus, requestDate, deliveryDate, totalAmount)
                        requests.add(requestData)
                    }
                    resultSet.close()
                    preparedStatement.close()
                }
            } catch (e: SQLException) {
                e.printStackTrace()
            } finally {
                try {
                    connection?.close()
                } catch (e: SQLException) {
                    e.printStackTrace()
                }
            }
            return requests
        }

        override fun onPostExecute(requests: List<RequestData>) {
            super.onPostExecute(requests)
            requestAdapter.clear()
            if (requests.isNotEmpty()) {
                requestAdapter.addAll(requests)
            } else {
                requestAdapter.add(RequestData(0, "", 0, "", null, null, 0.0))
            }
        }
    }

    companion object {
        @JvmStatic
        fun newInstance() = RequestFragment()
    }
}
