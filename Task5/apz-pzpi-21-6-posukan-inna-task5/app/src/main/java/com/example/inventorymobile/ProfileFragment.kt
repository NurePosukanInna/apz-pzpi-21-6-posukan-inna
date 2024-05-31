package com.example.inventorymobile

import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.example.inventorymobile.Connection.ConnectionClass
import com.example.inventorymobile.Data.UserData
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.sql.PreparedStatement
import java.sql.SQLException

class ProfileFragment : Fragment() {

    private lateinit var sharedPreferences: SharedPreferences
    private val connectionClass = ConnectionClass()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_profile, container, false)

        sharedPreferences =
            requireActivity().getSharedPreferences("UserPreferences", Context.MODE_PRIVATE)

        val userEmail = getUserEmailFromPrefs()

        val emailTextView = view.findViewById<TextView>(R.id.emailTextView)
        val firstNameTextView = view.findViewById<TextView>(R.id.firstNameEditText)
        val lastNameTextView = view.findViewById<TextView>(R.id.lastNameEditText)
        val phoneNumberTextView = view.findViewById<TextView>(R.id.phoneNumberEditText)

        emailTextView.text = userEmail

        fetchProfileDataAndUpdateUI(firstNameTextView, lastNameTextView, phoneNumberTextView)

        val updateButton = view.findViewById<Button>(R.id.updateButton)
        updateButton.setOnClickListener {
            val newFirstName = firstNameTextView.text.toString()
            val newLastName = lastNameTextView.text.toString()
            val newPhoneNumber = phoneNumberTextView.text.toString()
            updateUserDataInBackground(newFirstName, newLastName, newPhoneNumber)
        }

        val logoutButton = view.findViewById<Button>(R.id.logoutButton)
        logoutButton.setOnClickListener {
            logout()
        }

        return view
    }
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        (requireActivity() as? MainActivity)?.setToolbarTitle("Profile")
    }
    private fun getUserEmailFromPrefs(): String {
        return sharedPreferences.getString("email", "") ?: ""
    }

    private fun fetchProfileDataAndUpdateUI(
        firstNameTextView: TextView,
        lastNameTextView: TextView,
        phoneNumberTextView: TextView
    ) {
        GlobalScope.launch(Dispatchers.Main) {
            val profileData = withContext(Dispatchers.IO) {
                fetchProfileDataFromDatabase()
            }
            updateUI(profileData, firstNameTextView, lastNameTextView, phoneNumberTextView)
        }
    }

    private suspend fun fetchProfileDataFromDatabase(): UserData {
        var profileData = UserData("Не определено", "Не определено", "Не определено")
        val userEmail = getUserEmailFromPrefs()
        return withContext(Dispatchers.IO) {
            val connection = connectionClass.connectToSQL()
            try {
                if (connection != null) {
                    val query = "SELECT FirstName, LastName, PhoneNumber FROM [User] WHERE email = ?"
                    val preparedStatement: PreparedStatement = connection.prepareStatement(query)
                    preparedStatement.setString(1, userEmail)
                    val resultSet = preparedStatement.executeQuery()
                    if (resultSet.next()) {
                        val firstName = resultSet.getString("FirstName") ?: "Не определено"
                        val lastName = resultSet.getString("LastName") ?: "Не определено"
                        val phoneNumber = resultSet.getString("PhoneNumber") ?: "Не определено"
                        profileData = UserData(firstName, lastName, phoneNumber)
                    }
                    resultSet.close()
                    preparedStatement.close()
                }
            } catch (e: SQLException) {
                e.printStackTrace()
            } finally {
                connection?.close()
            }
            return@withContext profileData
        }
    }

    private fun updateUI(
        profileData: UserData,
        firstNameTextView: TextView,
        lastNameTextView: TextView,
        phoneNumberTextView: TextView
    ) {
        firstNameTextView.text = profileData.firstName
        lastNameTextView.text = profileData.lastName
        phoneNumberTextView.text = profileData.phoneNumber
    }

    private fun updateUserDataInBackground(newFirstName: String, newLastName: String, newPhoneNumber: String) {
        GlobalScope.launch(Dispatchers.Main) {
            val success = withContext(Dispatchers.IO) {
                performUpdateInBackground(newFirstName, newLastName, newPhoneNumber)
            }
            if (success) {
                Toast.makeText(context, "Data successfully updated", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(context, "Failed to update data", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private suspend fun performUpdateInBackground(newFirstName: String, newLastName: String, newPhoneNumber: String): Boolean {
        val userEmail = getUserEmailFromPrefs()
        return withContext(Dispatchers.IO) {
            val connection = connectionClass.connectToSQL()
            try {
                if (connection != null) {
                    val query = "UPDATE [User] SET FirstName = ?, LastName = ?, PhoneNumber = ? WHERE email = ?"
                    val preparedStatement: PreparedStatement = connection.prepareStatement(query)
                    preparedStatement.setString(1, newFirstName)
                    preparedStatement.setString(2, newLastName)
                    preparedStatement.setString(3, newPhoneNumber)
                    preparedStatement.setString(4, userEmail)
                    preparedStatement.executeUpdate()
                    preparedStatement.close()
                    return@withContext true
                } else {
                    return@withContext false
                }
            } catch (e: SQLException) {
                e.printStackTrace()
                return@withContext false
            } finally {
                connection?.close()
            }
        }
    }

    private fun logout() {
        sharedPreferences.edit().clear().apply()
        val intent = Intent(activity, LoginActivity::class.java)
        startActivity(intent)
        activity?.finish()
    }
}
