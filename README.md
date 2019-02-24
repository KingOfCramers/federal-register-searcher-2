# federal-register-searcher
Must have a config.js file in the key folder, configured as follows. This is for OAuth2 emailing (https://www.youtube.com/watch?v=JJ44WA_eV8E):

    const auth = {
      type: "OAuth2",
      user: "email",
      clientId: "",
      clientSecret: "",
      refreshToken: ""
    }

    module.exports = {
    auth
    }

Must also have a firebase admin.key.json in the key folder, for our Firebase Admin SDK, configured as follows:

    {
       "type":
       "project_id":
       "private_key_id":
       "private_key":
       "client_email":
       "client_id":
       "auth_uri":
       "token_uri":
       "auth_provider_x509_cert_url":
       "client_x509_cert_url":
    }

Must also use a bucket.js file, (more information https://firebase.google.com/docs/storage/admin/start#use_a_default_bucket)for our firebase firestorage, configured w/ url of the bucket:

{
  bucket: ""
}

Must create empty folder in zipper folder...

Must install python dependencies from this guide...

  https://medium.com/@rqaiserr/how-to-convert-pdfs-into-searchable-key-words-with-python-85aab86c544f

And must properly install textract dependencies here...

    https://textract.readthedocs.io/en/stable/installation.html