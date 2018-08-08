((window, $) => {
    window.api = {
      get: (url) => {
        return new Promise((resolve, reject) => {
            $.ajax({
              url: url,
              method: 'GET',
              xhrFields: { withCredentials: true },
              crossDomain: true,
              contentType: 'application/json',
              dataType: 'json'
            }).then((response) => {
              resolve(response);
            }, (err) => {
              reject(err);
            })
        });
      },
      delete: (url) => {
        return new Promise((resolve, reject) => {
            $.ajax({
              url: url,
              method: 'DELETE',
              xhrFields: { withCredentials: true },
              crossDomain: true,
              contentType: 'application/json',
              dataType: 'json'
            }).then((response) => {
              resolve(response);
            }, (err) => {
              reject(err);
            })
        });
      },
      post: (url, data) => {
        return new Promise((resolve, reject) => {
            $.ajax({
              url: url,
              method: 'POST',
              data: JSON.stringify(data),
              xhrFields: { withCredentials: true},
              crossDomain: true,
              dataType: 'json',
              contentType: 'application/json'
            }).then((response) => {
              resolve(response);
            }, (err) => {
              reject(err);
            })
        });
      }
    };
  
  })(window, $);
  
  