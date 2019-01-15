package com.example.moldo.android_studio_project;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

public class MainActivity extends AppCompatActivity {
    RequestQueue queue;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        queue = Volley.newRequestQueue(this);
    }
    public void sendMessage(View view) {
        System.out.println("Login clicked!");
        final Intent intent = new Intent(this, SecondActivity.class);

        String token = getLoginToken();
        if(!token.equals("-1"))
        {
            System.out.println("We have a login token!");
            startActivity(intent);
            return;
        }

        String url = "http://192.168.43.242:16000/api/login";

        EditText username_edit = (EditText) findViewById(R.id.editText2);
        EditText password_edit  = (EditText) findViewById(R.id.editText);
        String user = username_edit.getText().toString();
        String pass = password_edit.getText().toString();

        JSONObject jsonReq= new JSONObject();
        try {
            jsonReq.put("user", user);
            jsonReq.put("password", user);

        } catch (JSONException e) {
            e.printStackTrace();
        }
        System.out.println("Will send request!");
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest
                (Request.Method.POST, url, jsonReq, new Response.Listener<JSONObject>() {

                    @Override
                    public void onResponse(JSONObject response) {
                        System.out.println("Response: " + response.toString());
                        try {
                            if(response.getString("status").equals("True"))
                            {
                                System.out.println("Login ok!");
                                setLoginToken(response.getString("token"));
                                startActivity(intent);
                            }
                            else
                            {
                                System.out.println("Invalid login");
                                Toast.makeText(getApplicationContext(), "Invalid credentials!"
                                        , Toast.LENGTH_LONG).show();
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }

                    }
                }, new Response.ErrorListener() {

                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // TODO: Handle error
                        Toast.makeText(getApplicationContext(), "Error on login request!" +
                                error.toString(), Toast.LENGTH_LONG).show();
                    }
                });
        this.queue.add(jsonObjectRequest);
        System.out.println("Login function handler done!");

    }

    private String getLoginToken() {
        SharedPreferences sharedPref = this.getPreferences(Context.MODE_PRIVATE);
        String token = sharedPref.getString("login_token","-1");
        System.out.println("Got local token: " + token);
        return token;
    }

    private void setLoginToken(String token) {
        System.out.println("Will set local token "+ token);
        SharedPreferences sharedPref = this.getPreferences(Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPref.edit();
        editor.putString("login_token", token);
        editor.commit();
    }
}
