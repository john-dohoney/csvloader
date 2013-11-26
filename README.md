csvloader
=========

Web App for loading CSV files into UserGrid or Apigee App Services

###Set-Up<br/>
Make sure you have node.js installed, and be sure it is in your path
>  which node

Clone this app with the following command:
>  git clone https://github.com/john-dohoney/csvloader.git

Make sure the directory permissions will work, as the public/uploads directory will story the uploaded 
CSV file (e.g you set a umask)</br>
>  chmod -R 755 csvloader

###Operation<br/>
>  node app.js

###Comments<br/>
  The web app makes use of the Ace Editor, this allows for changes to the imported JSON.  The code does a
  decent job reading and parsing the CSV, thanks to ya-csv.  However, UserGrid is a little picky.  As an 
  example, you might see an element as follows:
<pre>
  [
   {
	"foo": "bar",
	"": "",
	"next": "element"
   }
  ]
</pre>
This will "JSONLint" just fine, but will not load.  From testing, elements like:
<pre>
		"": "",
</pre>
seem to cause an issue loading. So, for now, either remove those records, or add some data to load the complete document. You can have a public account or your account can have users.  If you require a login, be sure to check the login required check box. I always fat-finger my password, so the ability to toggle the password to plain text was added if there is a complaint about credentials.

###Known Issues:<br/>

The editor needs to operate in "code" mode, the tree mode does not seem to work properly. If you need to play around, and the editor gets in a bad state, just re-load the page.  You will lose your edits, as it re-reads the CSV file. You can have a public account or your account can have users.

###Next version:<br/>

I will add some upload diagnostics, better feedback on the upload, and I need to see if there will be any support for the App. 

###Credits:<br/>

This app was created with significant Open Source projects, jQuery, JsonEditor, Ace, Ya-CSV, Validator, Jade, 
Twitter Bootstrap, Node.js, and Express.
 
