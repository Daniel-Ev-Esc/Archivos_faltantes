var app = angular.module('reg', [
  'ui.router',
]);

app
  .config([
    '$httpProvider',
    function($httpProvider){

      // Add auth token to Authorization header
      $httpProvider.interceptors.push('AuthInterceptor');

    }])
  .run([
    'AuthService',
    'Session',
    function(AuthService, Session){

      // Startup, login if there's  a token.
      var token = Session.getToken();
      if (token){
        AuthService.loginWithToken(token);
      }

  }]);


const today = new Date()
angular.module('reg')
    .constant('EVENT_INFO', {
        NAME: 'HackMTY '+ today.getFullYear(),
    })
    .constant('DASHBOARD', {
        UNVERIFIED: 'You should have received an email asking you verify your email. Click the link in the email and you can start your application!',
        INCOMPLETE_TITLE: 'You still need to complete your application!',
        INCOMPLETE: 'If you do not complete your application before the [APP_DEADLINE], you will not be considered for the admissions lottery!',
        SUBMITTED_TITLE: 'Your application has been submitted!',
        SUBMITTED: 'Feel free to edit it at any time. However, once registration is closed, you will not be able to edit it any further.\nAdmissions will be determined by a random lottery. Please make sure your information is accurate before registration is closed!',
        CLOSED_AND_INCOMPLETE_TITLE: 'Unfortunately, registration has closed, and the lottery process has begun.',
        CLOSED_AND_INCOMPLETE: 'Because you have not completed your profile in time, you will not be eligible for the lottery process.',
        ADMITTED_AND_CAN_CONFIRM_TITLE: 'You must confirm by [CONFIRM_DEADLINE].',
        ADMITTED_AND_CANNOT_CONFIRM_TITLE: 'Your confirmation deadline of [CONFIRM_DEADLINE] has passed.',
        ADMITTED_AND_CANNOT_CONFIRM: 'Although you were accepted, you did not complete your confirmation in time.\nUnfortunately, this means that you will not be able to attend the event, as we must begin to accept other applicants on the waitlist.\nWe hope to see you again next year!',
        CONFIRMED_NOT_PAST_TITLE: 'You can edit your confirmation information until [CONFIRM_DEADLINE]',
        DECLINED: 'We\'re sorry to hear that you won\'t be able to make it to HackMIT 2018! :(\nMaybe next year! We hope you see you again soon.',
    })
    .constant('TEAM',{
        NO_TEAM_REG_CLOSED: 'Unfortunately, it\'s too late to enter the lottery with a team.\nHowever, you can still form teams on your own before or during the event!',
    })
    .constant('API_KEY', 'di0Tb_tcse8AAAAAAAAyrejVxheW7ipYkqJo5LBQej-6Vk2O8UYO5HThDI2KZtaA');

angular.module('reg')
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function(
      $stateProvider,
      $urlRouterProvider,
      $locationProvider) {

    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/404");

    // Set up de states
    $stateProvider
      .state('login', {
        url: "/login",
        templateUrl: "views/login/login.html",
        controller: 'LoginCtrl',
        data: {
          requireLogin: false
        },
        resolve: {
          'settings': ["SettingsService", function(SettingsService){
            return SettingsService.getPublicSettings();
          }]
        }
      })
      .state('app', {
        views: {
          '': {
            templateUrl: "views/base.html"
          },
          'sidebar@app': {
            templateUrl: "views/sidebar/sidebar.html",
            controller: 'SidebarCtrl',
            resolve: {
              'settings' : ["SettingsService", function(SettingsService) {
                return SettingsService.getPublicSettings();
              }]
            }

          }
        },
        data: {
          requireLogin: true
        }
      })
      .state('app.dashboard', {
        url: "/",
        templateUrl: "views/dashboard/dashboard.html",
        controller: 'DashboardCtrl',
        resolve: {
          currentUser: ["UserService", function(UserService){
            return UserService.getCurrentUser();
          }],
          settings: ["SettingsService", function(SettingsService){
            return SettingsService.getPublicSettings();
          }]
        },
      })
      .state('app.application', {
        url: "/application",
        templateUrl: "views/application/application.html",
        controller: 'ApplicationCtrl',
        resolve: {
          currentUser: ["UserService", function(UserService){
            return UserService.getCurrentUser();
          }],
          settings: ["SettingsService", function(SettingsService){
            return SettingsService.getPublicSettings();
          }]
        }
      })
      .state('app.confirmation', {
        url: "/confirmation",
        templateUrl: "views/confirmation/confirmation.html",
        controller: 'ConfirmationCtrl',
        resolve: {
          currentUser: ["UserService", function(UserService){
            return UserService.getCurrentUser();
          }],
          settings: ["SettingsService", function(SettingsService){
            return SettingsService.getPublicSettings();
          }]
        }
      })
      .state('app.team', {
        url: "/team",
        templateUrl: "views/team/team.html",
        controller: 'TeamCtrl',
        data: {
          requireVerified: true
        },
        resolve: {
          currentUser: ["UserService", function(UserService){
            return UserService.getCurrentUser();
          }],
          settings: ["SettingsService", function(SettingsService){
            return SettingsService.getPublicSettings();
          }]
        }
      })
      .state('app.workshops', {
        url: "/workshops",
        templateUrl: "views/workshops/workshops.html",
        controller: 'workshopsCtrl',
        data: {
          requireVerified: true
        },
        resolve: {
          currentUser: ["UserService", function(UserService){
            return UserService.getCurrentUser();
          }],
          settings: ["SettingsService", function(SettingsService){
            return SettingsService.getPublicSettings();
          }]
        }
      })
      .state('app.challenges', {
        url: "/challenges",
        templateUrl: "views/challenges/challenges.html",
        controller: 'challengesCtrl',
        data: {
          requireVerified: true
        },
        resolve: {
          currentUser: ["UserService", function(UserService){
            return UserService.getCurrentUser();
          }],
          settings: ["SettingsService", function(SettingsService){
            return SettingsService.getPublicSettings();
          }]
        }
      })
      .state('app.admin', {
        views: {
          '': {
            templateUrl: "views/admin/admin.html",
            controller: 'AdminCtrl'
          }
        },
        data: {
          requireAdmin: true
        }
      })
      .state('app.admin.stats', {
        url: "/admin",
        templateUrl: "views/admin/stats/stats.html",
        controller: 'AdminStatsCtrl'
      })
      .state('app.admin.users', {
        url: "/admin/users?" +
          '&page' +
          '&size' +
          '&query',
        templateUrl: "views/admin/users/users.html",
        controller: 'AdminUsersCtrl'
      })
      .state('app.admin.user', {
        url: "/admin/users/:id",
        templateUrl: "views/admin/user/user.html",
        controller: 'AdminUserCtrl',
        resolve: {
          'user': ["$stateParams", "UserService", function($stateParams, UserService){
            return UserService.get($stateParams.id);
          }]
        }
      })
      .state('app.admin.settings', {
        url: "/admin/settings",
        templateUrl: "views/admin/settings/settings.html",
        controller: 'AdminSettingsCtrl',
      })
      .state('reset', {
        url: "/reset/:token",
        templateUrl: "views/reset/reset.html",
        controller: 'ResetCtrl',
        data: {
          requireLogin: false
        }
      })
      .state('verify', {
        url: "/verify/:token",
        templateUrl: "views/verify/verify.html",
        controller: 'VerifyCtrl',
        data: {
          requireLogin: false
        }
      })
      .state('404', {
        url: "/404",
        templateUrl: "views/404.html",
        data: {
          requireLogin: false
        }
      });

    $locationProvider.html5Mode({
      enabled: true,
    });

  }])
  .run([
    '$rootScope',
    '$state',
    'Session',
    function(
      $rootScope,
      $state,
      Session ){

      $rootScope.$on('$stateChangeSuccess', function() {
         document.body.scrollTop = document.documentElement.scrollTop = 0;
      });

      $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        var requireLogin = toState.data.requireLogin;
        var requireAdmin = toState.data.requireAdmin;
        var requireVerified = toState.data.requireVerified;

        if (requireLogin && !Session.getToken()) {
          event.preventDefault();
          $state.go('login');
        }

        if (requireAdmin && !Session.getUser().admin) {
          event.preventDefault();
          $state.go('app.dashboard');
        }

        if (requireVerified && !Session.getUser().verified){
          event.preventDefault();
          $state.go('app.dashboard');
        }

      });

    }]);

angular.module('reg')
  .factory('AuthInterceptor', [
    'Session',
    function(Session){
      return {
          request: function(config){
            var token = Session.getToken();
            if (token && config.url.search("dropbox") == -1){
              config.headers['x-access-token'] = token;
            }
            return config;
          }
        };
    }]);

angular.module('reg')
  .service('Session', [
    '$rootScope',
    '$window',
    function($rootScope, $window){

    this.create = function(token, user){
      $window.localStorage.jwt = token;
      $window.localStorage.userId = user._id;
      $window.localStorage.currentUser = JSON.stringify(user);
      $rootScope.currentUser = user;
    };

    this.destroy = function(onComplete){
      delete $window.localStorage.jwt;
      delete $window.localStorage.userId;
      delete $window.localStorage.currentUser;
      $rootScope.currentUser = null;
      if (onComplete){
        onComplete();
      }
    };

    this.getToken = function(){
      return $window.localStorage.jwt;
    };

    this.getUserId = function(){
      return $window.localStorage.userId;
    };

    this.getUser = function(){
      return JSON.parse($window.localStorage.currentUser);
    };

    this.setUser = function(user){
      $window.localStorage.currentUser = JSON.stringify(user);
      $rootScope.currentUser = user;
    };

  }]);
angular.module('reg')
  .factory('Utils', [
    function(){
      return {
        isRegOpen: function(settings){
          return Date.now() > settings.timeOpen && Date.now() < settings.timeClose;
        },
        isAfter: function(time){
          return Date.now() > time;
        },
        formatTime: function(time){

          if (!time){
            return "Invalid Date";
          }

          date = new Date(time);
          var timeZone = moment.tz.guess();
          var timeZoneOffset = date.getTimezoneOffset();

          // Hack for timezone
          return moment(date).format('dddd, MMMM Do YYYY, h:mm a') +
            " " + moment.tz.zone(timeZone).abbr(timeZoneOffset);

        }
      };
    }]);
angular.module('reg')
  .factory('AuthService', [
    '$http',
    '$rootScope',
    '$state',
    '$window',
    'Session',
    function($http, $rootScope, $state, $window, Session) {
      var authService = {};

      function loginSuccess(data, cb){
        // Winner winner you get a token
        Session.create(data.token, data.user);

        if (cb){
          cb(data.user);
        }
      }

      function loginFailure(data, cb){
        $state.go('login');
        if (cb) {
          cb(data);
        }
      }

      authService.loginWithPassword = function(email, password, onSuccess, onFailure) {
        return $http
          .post('/auth/login', {
            email: email,
            password: password
          })
          .success(function(data){
            loginSuccess(data, onSuccess);
          })
          .error(function(data){
            loginFailure(data, onFailure);
          });
      };

      authService.loginWithToken = function(token, onSuccess, onFailure){
        return $http
          .post('/auth/login', {
            token: token
          })
          .success(function(data){
            loginSuccess(data, onSuccess);
          })
          .error(function(data, statusCode){
            if (statusCode === 400){
              Session.destroy(loginFailure);
            }
          });
      };

      authService.logout = function(callback) {
        // Clear the session
        Session.destroy(callback);
        $state.go('login');
      };

      authService.register = function(email, password, onSuccess, onFailure) {
        return $http
          .post('/auth/register', {
            email: email,
            password: password
          })
          .success(function(data){
            loginSuccess(data, onSuccess);
          })
          .error(function(data){
            loginFailure(data, onFailure);
          });
      };

      authService.verify = function(token, onSuccess, onFailure) {
        return $http
          .get('/auth/verify/' + token)
          .success(function(user){
            Session.setUser(user);
            if (onSuccess){
              onSuccess(user);
            }
          })
          .error(function(data){
            if (onFailure) {
              onFailure(data);
            }
          });
      };

      authService.resendVerificationEmail = function(onSuccess, onFailure){
        return $http
          .post('/auth/verify/resend', {
            id: Session.getUserId()
          });
      };

      authService.sendResetEmail = function(email){
        return $http
          .post('/auth/reset', {
            email: email
          });
      };

      authService.resetPassword = function(token, pass, onSuccess, onFailure){
        return $http
          .post('/auth/reset/password', {
            token: token,
            password: pass
          })
          .success(onSuccess)
          .error(onFailure);
      };

      return authService;
    }
  ]);
angular.module('reg')
  .factory('SettingsService', [
  '$http',
  function($http){

    var base = '/api/settings/';

    return {
      getPublicSettings: function(){
        return $http.get(base);
      },
      updateRegistrationTimes: function(open, close){
        return $http.put(base + 'times', {
          timeOpen: open,
          timeClose: close,
        });
      },
      updateConfirmationTime: function(time){
        return $http.put(base + 'confirm-by', {
          time: time
        });
      },
      getWhitelistedEmails: function(){
        return $http.get(base + 'whitelist');
      },
      updateWhitelistedEmails: function(emails){
        return $http.put(base + 'whitelist', {
          emails: emails
        });
      },
      updateWaitlistText: function(text){
        return $http.put(base + 'waitlist', {
          text: text
        });
      },
      updateAcceptanceText: function(text){
        return $http.put(base + 'acceptance', {
          text: text
        });
      },
      updateConfirmationText: function(text){
        return $http.put(base + 'confirmation', {
          text: text
        });
      },
      updateCheckInOpen: function(number){
        return $http.put( base + 'checkInOpen', {
          checkInOpen: number
        })
      },
      updateTeamSizeAccepted: function (number) {
        return $http.put( base + 'teamSizeAccepted', {
          teamSizeAccepted: number
        })
      },
      updateHackLocation: function (latitude, longitude) {
        return $http.put( base + 'hackLocation', {
          latitude: latitude,
          longitude: longitude
        })
      },
      updateMaxTableCount: function (number) {
        return $http.put( base + 'maxTableCount', {
          maxTableCount: number
        })
      }
    };

  }
  ]);

angular.module('reg')
  .factory('UserService', [
    '$http',
    'Session',
    'API_KEY',
    function($http, Session, API_KEY){

      var users = '/api/users';
      var base = users + '/';

      function http_header_safe_json(v) {

      var charsToEncode = /[\u007f-\uffff]/g;

        return JSON.stringify(v).replace(charsToEncode,
          function(c) {
            return '\\u'+('000'+c.charCodeAt(0).toString(16)).slice(-4);
          }
        );
      }

    return {

      // ----------------------
      // Basic Actions
      // ----------------------
      getCurrentUser: function(){
        return $http.get(base + Session.getUserId());

      },
      get: function(id){
        return $http.get(base + id);
      },

      getAll: function(){
        return $http.get(base);
      },

      getPage: function(page, size, text){
        return $http.get(users + '?' + $.param(
          {
            text: text,
            page: page ? page : 0,
            size: size ? size : 50
          })
        );
      },

      updateProfile: function(id, profile){
        return $http.put(base + id + '/profile', {
          profile: profile
        });
      },

      updateResume: function(id, file){
        var ext = file.name.split(".")[file.name.split(".").length - 1];
        $http({
          method: 'POST',
          url: 'https://content.dropboxapi.com/2/files/upload',
          data: file,
          headers : {
            'Authorization' : 'Bearer ' + API_KEY,
            'Content-Type' : 'application/octet-stream',
            'Dropbox-Api-Arg' : http_header_safe_json({
              'path' : '/' + id + "." + ext,
              'mode' : 'overwrite',
              'autorename' : true,
              'mute' : false
            })
          }
        }).success(function(data, status, headers, config) {
          console.log(data);
          console.log('file uploaded successfully');
        }).error(function(data, status, headers, config) {
          console.log('error : ' + data);
        });
      },

      updateConfirmation: function(id, confirmation){
        return $http.put(base + id + '/confirm', {
          confirmation: confirmation
        });
      },

      declineAdmission: function(id){
        return $http.post(base + id + '/decline');
      },
      
      makeCheckIn: function(latitude, longitude) {
        coordinates = {
          latitude: latitude,
          longitude: longitude
        };
        return $http.post(base + Session.getUserId() + '/checkin/location ', { coordinates:coordinates } );
      },

      // ------------------------
      // Team
      // ------------------------
      joinOrCreateTeam: function(code){
        return $http.put(base + Session.getUserId() + '/team', {
          code: code
        });
      },

      leaveTeam: function(){
        return $http.delete(base + Session.getUserId() + '/team');
      },

      getMyTeammates: function(){
        return $http.get(base + Session.getUserId() + '/team');
      },
      
      assingTable: function() {
        return $http.post( base + Session.getUserId() + '/confirmed');
      },

      // -------------------------
      // Admin Only
      // -------------------------

      getStats: function(){
        return $http.get(base + 'stats');
      },

      admitUser: function(id){
        return $http.post(base + id + '/admit');
      },

      checkIn: function(id){
        return $http.post(base + id + '/checkin');
      },

      checkOut: function(id){
        return $http.post(base + id + '/checkout');
      },

      updateTable: function(teamCode, tableNumber) {
        return $http.put('/api/teams/' + teamCode + '/table', {
          tableNumber: tableNumber
        })
      }
    };
  }
  ]);

angular.module('reg')
  .controller('AdminSettingsCtrl', [
    '$scope',
    '$sce',
    'SettingsService',
    function($scope, $sce, SettingsService){

      $scope.settings = {};
      SettingsService
        .getPublicSettings()
        .success(function(settings){
          updateSettings(settings);
        });

      function updateSettings(settings){
        $scope.loading = false;
        settings.timeOpen = new Date(settings.timeOpen);
        settings.timeClose = new Date(settings.timeClose);
        settings.timeConfirm = new Date(settings.timeConfirm);
        settings.checkInOpen = new Date(settings.checkInOpen);

        $scope.settings = settings;
      }

      // Whitelist --------------------------------------

      SettingsService
        .getWhitelistedEmails()
        .success(function(emails){
          $scope.whitelist = emails.join(", ");
        });

      $scope.updateWhitelist = function(){
        SettingsService
          .updateWhitelistedEmails($scope.whitelist.replace(/ /g, '').split(','))
          .success(function(settings){
            swal('Whitelist updated.');
            $scope.whitelist = settings.whitelistedEmails.join(", ");
          });
      };

      // Registration Times -----------------------------

      $scope.formatDate = function(date){
        if (!date){
          return "Invalid Date";
        }

        var timeZone = moment.tz.guess();
        var timeZoneOffset = date.getTimezoneOffset();

        // Hack for timezone
        return moment(date).format('dddd, MMMM Do YYYY, h:mm a') +
          " " + moment.tz.zone(timeZone).abbr(timeZoneOffset);
      };

      // Take a date and remove the seconds.
      function cleanDate(date){
        return new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes()
        );
      }

      $scope.updateRegistrationTimes = function(){
        // Clean the dates and turn them to ms.
        var open = cleanDate($scope.settings.timeOpen).getTime();
        var close = cleanDate($scope.settings.timeClose).getTime();

        if (open < 0 || close < 0 || open === undefined || close === undefined){
          return swal('Oops...', 'You need to enter valid times.', 'error');
        }
        if (open >= close){
          swal('Oops...', 'Registration cannot open after it closes.', 'error');
          return;
        }

        SettingsService
          .updateRegistrationTimes(open, close)
          .success(function(settings){
            updateSettings(settings);
            swal("Looks good!", "Registration Times Updated", "success");
          });
      };

      // Confirmation Time -----------------------------

      $scope.updateConfirmationTime = function(){
        var confirmBy = cleanDate($scope.settings.timeConfirm).getTime();

        SettingsService
          .updateConfirmationTime(confirmBy)
          .success(function(settings){
            updateSettings(settings);
            swal("Sounds good!", "Confirmation Date Updated", "success");
          });
      };

      // Acceptance / Confirmation Text ----------------

      var converter = new showdown.Converter();

      $scope.markdownPreview = function(text){
        return $sce.trustAsHtml(converter.makeHtml(text));
      };

      $scope.updateWaitlistText = function(){
        var text = $scope.settings.waitlistText;
        SettingsService
          .updateWaitlistText(text)
          .success(function(data){
            swal("Looks good!", "Waitlist Text Updated", "success");
            updateSettings(data);
          });
      };

      $scope.updateAcceptanceText = function(){
        var text = $scope.settings.acceptanceText;
        SettingsService
          .updateAcceptanceText(text)
          .success(function(data){
            swal("Looks good!", "Acceptance Text Updated", "success");
            updateSettings(data);
          });
      };

      $scope.updateConfirmationText = function(){
        var text = $scope.settings.confirmationText;
        SettingsService
          .updateConfirmationText(text)
          .success(function(data){
            swal("Looks good!", "Confirmation Text Updated", "success");
            updateSettings(data);
          });
      };
      
      // CheckInOpen ---------------------------------------
        $scope.updateCheckInOpen = function() {
          var CheckInOpen = cleanDate($scope.settings.checkInOpen).getTime();
          
          SettingsService
              .updateCheckInOpen(CheckInOpen)
              .success(function(data){
                  swal("Looks good!", "Check In Open Updated", "success");
                  updateSettings(data);
              });
        };
        
        // Team Size to be accepted ------------------------
        $scope.updateTeamSizeAccepted = function() {
            var number = $scope.settings.teamSizeAccepted;
            SettingsService
                .updateTeamSizeAccepted(number)
                .success(function(data){
                    swal("Looks good!", "Team Size to be Accepted Updated", "success");
                    updateSettings(data);
                });
        };
        
        // Location of the hack ----------------------------
        $scope.updateHackLocation = function() {
            var latitude = $scope.settings.hackLocation.latitude;
            var longitude = $scope.settings.hackLocation.longitude;
            SettingsService
                .updateHackLocation(latitude, longitude)
                .success(function(data) {
                    swal("Looks good!", "Location of the Hack has been Updated", "success");
                    updateSettings(data);
                })
        }
        
        // Max table count ---------------------------------
        $scope.updateMaxTableCount = function() {
            var number = $scope.settings.maxTableCount;
            SettingsService
                .updateMaxTableCount(number)
                .success(function (data) {
                    swal("Looks good!", "Max Number of Tables Updated", "success");
                    updateSettings(data);
                })
        }

    }]);

angular.module('reg')
  .controller('AdminUserCtrl',[
    '$scope',
    '$http',
    'user',
    'UserService',
    function($scope, $http, User, UserService){
      $scope.selectedUser = User.data;

      // Populate the school dropdown
      populateSchools();

      /**
       * TODO: JANK WARNING
       */
      function populateSchools(){

        $http
          .get('/assets/schools.json')
          .then(function(res){
            var schools = res.data;
            var email = $scope.selectedUser.email.split('@')[1];

            if (schools[email]){
              $scope.selectedUser.profile.school = schools[email].school;
              $scope.autoFilledSchool = true;
            }

          });
      }

      $scope.graduationYears = function() {
        var graduationYears = []
        const today = new Date();
        const thisYear = today.getFullYear();
        for (var i = 0; i < 6; i++) {
          graduationYears[i] = thisYear+i;
        }
        return graduationYears;
      }();


      $scope.updateProfile = function(){
        UserService
          .updateProfile($scope.selectedUser._id, $scope.selectedUser.profile)
          .success(function(data){
            $selectedUser = data;
            swal("Updated!", "Profile updated.", "success");
          })
          .error(function(){
            swal("Oops, you forgot something.");
          });
      };
      $scope.updateTable = function() {
        UserService.updateTable($scope.selectedUser.teamCode, $scope.selectedUser.status.tableNumber)
        .success(function(data) {
          swal("Updated!", "Table number updated.", "success");
        })
        .error(function(data) {
          console.log('data :>> ', data);          
          swal("Oops!", data.message, "error");
        })
      }

    }]);
angular.module('reg')
  .controller('AdminStatsCtrl',[
    '$scope',
    'UserService',
    function($scope, UserService){

      UserService
        .getStats()
        .success(function(stats){
          $scope.stats = stats;

          var today = new Date();
          var year = today.getFullYear();

          $scope.stats.years = [];
          for (var index = 0; index <= 5; index++) {
            var obj = {
              amount: $scope.stats.demo.year[year + index],
              year: year + index,
            }
            $scope.stats.years.push(obj);
          }
          $scope.loading = false;
        });

      $scope.fromNow = function(date){
        return moment(date).fromNow();
      };

    }]);
angular.module('reg')
  .controller('AdminUsersCtrl',[
    '$scope',
    '$state',
    '$stateParams',
    'UserService',
    function($scope, $state, $stateParams, UserService){

      $scope.pages = [];
      $scope.users = [];

      // Semantic-UI moves modal content into a dimmer at the top level.
      // While this is usually nice, it means that with our routing will generate
      // multiple modals if you change state. Kill the top level dimmer node on initial load
      // to prevent this.
      $('.ui.dimmer').remove();
      // Populate the size of the modal for when it appears, with an arbitrary user.
      $scope.selectedUser = {};
      $scope.selectedUser.sections = generateSections({status: '', confirmation: {
        dietaryRestrictions: []
      }, profile: ''});

      function updatePage(data){
        $scope.users = data.users;
        $scope.currentPage = data.page;
        $scope.pageSize = data.size;

        var p = [];
        for (var i = 0; i < data.totalPages; i++){
          p.push(i);
        }
        $scope.pages = p;
      }

      UserService
        .getPage($stateParams.page, $stateParams.size, $stateParams.query)
        .success(function(data){
          updatePage(data);
        });

      $scope.$watch('queryText', function(queryText){
        UserService
          .getPage($stateParams.page, $stateParams.size, queryText)
          .success(function(data){
            updatePage(data);
          });
      });

      $scope.goToPage = function(page){
        $state.go('app.admin.users', {
          page: page,
          size: $stateParams.size || 50
        });
      };

      $scope.goUser = function($event, user){
        $event.stopPropagation();

        $state.go('app.admin.user', {
          id: user._id
        });
      };

      $scope.toggleCheckIn = function($event, user, index) {
        $event.stopPropagation();

        if (!user.status.checkedIn){
          swal({
            title: "Whoa, wait a minute!",
            text: "You are about to check in " + user.profile.name + "!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, check them in.",
            closeOnConfirm: false
            },
            function(){
              UserService
                .checkIn(user._id)
                .success(function(user){
                  $scope.users[index] = user;
                  swal("Accepted", user.profile.name + ' has been checked in.', "success");
                });
            }
          );
        } else {
          UserService
            .checkOut(user._id)
            .success(function(user){
              $scope.users[index] = user;
              swal("Accepted", user.profile.name + ' has been checked out.', "success");
            });
        }
      };

      $scope.acceptUser = function($event, user, index) {
        $event.stopPropagation();

        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to accept " + user.profile.name + "!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, accept them.",
          closeOnConfirm: false
          }, function(){

            swal({
              title: "Are you sure?",
              text: "Your account will be logged as having accepted this user. " +
                "Remember, this power is a privilege.",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, accept this user.",
              closeOnConfirm: false
              }, function(){

                UserService
                  .admitUser(user._id)
                  .success(function(user){
                    $scope.users[index] = user;
                    swal("Accepted", user.profile.name + ' has been admitted.', "success");
                  });

              });

          });

      };

      function formatTime(time){
        if (time) {
          return moment(time).format('MMMM Do YYYY, h:mm:ss a');
        }
      }

      $scope.rowClass = function(user) {
        if (user.admin){
          return 'admin';
        }
        if (user.status.confirmed) {
          return 'positive';
        }
        if (user.status.admitted && !user.status.confirmed) {
          return 'warning';
        }
      };

      function selectUser(user){
        $scope.selectedUser = user;
        $scope.selectedUser.sections = generateSections(user);
        $('.long.user.modal')
          .modal('show');
      }

      function generateSections(user){
        return [
          {
            name: 'Basic Info',
            fields: [
              {
                name: 'Created On',
                value: formatTime(user.timestamp)
              },{
                name: 'Last Updated',
                value: formatTime(user.lastUpdated)
              },{
                name: 'Confirm By',
                value: formatTime(user.status.confirmBy) || 'N/A'
              },{
                name: 'Checked In',
                value: formatTime(user.status.checkInTime) || 'N/A'
              },{
                name: 'Email',
                value: user.email
              },{
                name: 'Team',
                value: user.teamCode || 'None'
              }
            ]
          },{
            name: 'Profile',
            fields: [
              {
                name: 'Name',
                value: user.profile.name
              },{
                name: 'Gender',
                value: user.profile.gender
              },{
                name: 'School',
                value: user.profile.school
              },{
                name: 'Graduation Year',
                value: user.profile.graduationYear
              },{
                name: 'Description',
                value: user.profile.description
              },{
                name: 'Essay',
                value: user.profile.essay
              }
            ]
          },{
            name: 'Confirmation',
            fields: [
              {
                name: 'Phone Number',
                value: user.confirmation.phoneNumber
              },{
                name: 'Dietary Restrictions',
                value: user.confirmation.dietaryRestrictions.join(', ')
              },{
                name: 'Shirt Size',
                value: user.confirmation.shirtSize
              },{
                name: 'Major',
                value: user.confirmation.major
              },{
                name: 'Github',
                value: user.confirmation.github
              },{
                name: 'Website',
                value: user.confirmation.website
              },{
                name: 'Needs Hardware',
                value: user.confirmation.needsHardware,
                type: 'boolean'
              },{
                name: 'Hardware Requested',
                value: user.confirmation.hardware
              }
            ]
          },{
            name: 'Hosting',
            fields: [
              {
                name: 'Needs Hosting Friday',
                value: user.confirmation.hostNeededFri,
                type: 'boolean'
              },{
                name: 'Needs Hosting Saturday',
                value: user.confirmation.hostNeededSat,
                type: 'boolean'
              },{
                name: 'Gender Neutral',
                value: user.confirmation.genderNeutral,
                type: 'boolean'
              },{
                name: 'Cat Friendly',
                value: user.confirmation.catFriendly,
                type: 'boolean'
              },{
                name: 'Smoking Friendly',
                value: user.confirmation.smokingFriendly,
                type: 'boolean'
              },{
                name: 'Hosting Notes',
                value: user.confirmation.hostNotes
              }
            ]
          },{
            name: 'Travel',
            fields: [
              {
                name: 'Needs Reimbursement',
                value: user.confirmation.needsReimbursement,
                type: 'boolean'
              },{
                name: 'Received Reimbursement',
                value: user.confirmation.needsReimbursement && user.status.reimbursementGiven
              },{
                name: 'Address',
                value: user.confirmation.address ? [
                  user.confirmation.address.line1,
                  user.confirmation.address.line2,
                  user.confirmation.address.city,
                  ',',
                  user.confirmation.address.state,
                  user.confirmation.address.zip,
                  ',',
                  user.confirmation.address.country,
                ].join(' ') : ''
              },{
                name: 'Additional Notes',
                value: user.confirmation.notes
              }
            ]
          }
        ];
      }

      $scope.selectUser = selectUser;

    }]);












































angular.module('reg')
    .controller('ApplicationCtrl', [
      '$scope',
      '$rootScope',
      '$state',
      '$http',
      'currentUser',
      'settings',
      'Session',
      'UserService',
      function($scope, $rootScope, $state, $http, currentUser, Settings, Session, UserService){

        // Set up the user
        $scope.user = currentUser.data;
        // Is the student from MIT?
        $scope.isMitStudent = $scope.user.email.split('@')[1] == 'mit.edu';

        // If so, default them to adult: true
        if ($scope.isMitStudent){
          $scope.user.profile.adult = true;
        }
        if(!["Tecnológico de Monterrey Campus Monterrey", "Tecnológico de Monterrey Campus Guadalajara","Tecnológico de Monterrey Campus Puebla","Tecnológico de Monterrey Campus Ciudad de México","Tecnológico de Monterrey Campus Santa Fé","Tecnológico de Monterrey Campus Laguna","Tecnológico de Monterrey Campus San Luis","Universidad de Monterrey"].includes($scope.user.profile.school)) {
          $scope.user.profile.otherSchool = $scope.user.profile.school
          $scope.user.profile.school = "Otro"
        }
        $scope.isOtherSchool = $scope.user.profile.school === "Otro";

        // Populate the school dropdown
        populateSchools();
        _setupForm();

        $scope.regIsClosed = Date.now() > Settings.data.timeClose;
        $scope.checkInActive = Settings.data.checkInActive;
        /**
         * TODO: JANK WARNING
         */
        function populateSchools(){

          $http
              .get('/assets/schools.json')
              .then(function(res){
                var schools = res.data;
                var email = $scope.user.email.split('@')[1];

                if (schools[email]){
                  $scope.user.profile.school = schools[email].school;
                  $scope.autoFilledSchool = true;
                }
              });
        }

        function _updateUser(e){
          var file = angular.element('#resume-file')[0].files[0];

          if(file && file.size > 5000000) {
            sweetAlert("Your file is too big :(");
            return;
          }

          if(file){
            UserService.updateResume(Session.getUserId(), file);
            $scope.user.profile.cv = file.name;
            console.log($scope.user.profile.cv);
          }


          if($scope.isOtherSchool){
            $scope.user.profile.school = $scope.user.profile.otherSchool
          }
          UserService
              .updateProfile(Session.getUserId(), $scope.user.profile)
              .success(function(data){
                sweetAlert({
                  title: "Awesome!",
                  text: "Your application has been saved.",
                  type: "success",
                  confirmButtonColor: "#e76482"
                }, function(){
                  $state.go('app.dashboard');
                });
              })
              .error(function(err){
                console.log('err :>> ', err);
                if(err.showable) {
                  sweetAlert("Uh oh!", err.message, "error");
                } else {
                  sweetAlert("Uh oh!", "Something went wrong.", "error");
                }
                $scope.user.profile.school = "Otro"
              });
        }

        function _setupForm(){
          // Semantic-UI form validation
          $('.ui.form').form({
            fields: {
              name: {
                identifier: 'name',
                rules: [
                  {
                    type: 'empty',
                    prompt: 'Please enter your name.'
                  }
                ]
              },
              discordUsername: {
                identifier: 'discordUsername',
                rules: [
                  {
                    type: 'empty',
                    prompt: 'Please enter your Discord username.'
                  }
                ]
              },
              school: {
                identifier: 'school',
                rules: [
                  {
                    type: 'empty',
                    prompt: 'Please enter your school name.'
                  }
                ]
              },
              year: {
                identifier: 'year',
                rules: [
                  {
                    type: 'empty',
                    prompt: 'Please select your graduation year.'
                  }
                ]
              },
              gender: {
                identifier: 'gender',
                rules: [
                  {
                    type: 'empty',
                    prompt: 'Please select a gender.'
                  }
                ]
              },
              adult: {
                identifier: 'adult',
                rules: [
                  {
                    type: 'checked',
                    prompt: 'You must be an adult, or an MIT student.'
                  }
                ]
              }
            }
          });
        }

        $scope.graduationYears = []
        const today = new Date();
        const thisYear = today.getFullYear();
        for (var i = 0; i < 6; i++) {
          $scope.graduationYears[i] = thisYear+i;
        }

        $scope.checkOtherSchool = function() {
          $scope.isOtherSchool = $scope.user.profile.school === "Otro";
          if(!$scope.isOtherSchool) {
            $scope.user.profile.otherSchool = '';
          }
        }

        $scope.submitForm = function(){
          if ((".ui.form").form('is valid')){
            _updateUser();
          }
        };

      }]);
angular.module('reg')
  .controller('ChallengesCtrl', [
    '$rootScope',
    '$scope',
    '$sce',
    'currentUser',
    'settings',
    'Utils',
    'AuthService',
    'UserService',
    'EVENT_INFO',
    'DASHBOARD',
    function($rootScope, $scope, $sce, currentUser, settings, Utils, AuthService, UserService, DASHBOARD){
      var Settings = settings.data;
      var user = currentUser.data;
      $scope.user = user;

      $scope.DASHBOARD = DASHBOARD;
      
      for (var msg in $scope.DASHBOARD) {
        if ($scope.DASHBOARD[msg].includes('[APP_DEADLINE]')) {
          $scope.DASHBOARD[msg] = $scope.DASHBOARD[msg].replace('[APP_DEADLINE]', Utils.formatTime(Settings.timeClose));
        }
        if ($scope.DASHBOARD[msg].includes('[CONFIRM_DEADLINE]')) {
          $scope.DASHBOARD[msg] = $scope.DASHBOARD[msg].replace('[CONFIRM_DEADLINE]', Utils.formatTime(user.status.confirmBy));
        }
      }

      // Is registration open?
      var regIsOpen = $scope.regIsOpen = Utils.isRegOpen(Settings);

      // Is it past the user's confirmation time?
      var pastConfirmation = $scope.pastConfirmation = Utils.isAfter(user.status.confirmBy);

      $scope.dashState = function(status){
        var user = $scope.user;
        switch (status) {
          case 'unverified':
            return !user.verified;
          case 'openAndIncomplete':
            return regIsOpen && user.verified && !user.status.completedProfile;
          case 'openAndSubmitted':
            return regIsOpen && user.status.completedProfile && !user.status.admitted;
          case 'closedAndIncomplete':
            return !regIsOpen && !user.status.completedProfile && !user.status.admitted;
          case 'closedAndSubmitted': // Waitlisted State
            return !regIsOpen && user.status.completedProfile && !user.status.admitted;
          case 'admittedAndCanConfirm':
            return !pastConfirmation &&
              user.status.admitted &&
              !user.status.confirmed &&
              !user.status.declined;
          case 'admittedAndCannotConfirm':
            return pastConfirmation &&
              user.status.admitted &&
              !user.status.confirmed &&
              !user.status.declined;
          case 'confirmed':
            return user.status.admitted && user.status.confirmed && !user.status.declined;
          case 'declined':
            return user.status.declined;
        }
        return false;
      };

      $scope.showWaitlist = !regIsOpen && user.status.completedProfile && !user.status.admitted;

      $scope.resendEmail = function(){
        AuthService
          .resendVerificationEmail()
          .then(function(){
            sweetAlert('Your email has been sent.');
          });
      };


      // -----------------------------------------------------
      // Text!
      // -----------------------------------------------------
      var converter = new showdown.Converter();
      $scope.acceptanceText = $sce.trustAsHtml(converter.makeHtml(Settings.acceptanceText));
      $scope.confirmationText = $sce.trustAsHtml(converter.makeHtml(Settings.confirmationText));
      $scope.waitlistText = $sce.trustAsHtml(converter.makeHtml(Settings.waitlistText));


      $scope.declineAdmission = function(){

        swal({
          title: "Whoa!",
          text: "Are you sure you would like to decline your admission? \n\n You can't go back!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, I can't make it.",
          closeOnConfirm: true
          }, function(){

            UserService
              .declineAdmission(user._id)
              .success(function(user){
                $rootScope.currentUser = user;
                $scope.user = user;
              });
        });
      };

    }]);

angular.module('reg')
  .controller('ConfirmationCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'currentUser',
    'Utils',
    'UserService',
    'settings',
    function($scope, $rootScope, $state, currentUser, Utils, UserService, settings){

      // Set up the user
      var user = currentUser.data;
      $scope.user = user;
      
      // Set up settings
      var Settings = settings.data;
      $scope.checkInActive = Settings.checkInActive;

      $scope.pastConfirmation = Date.now() > user.status.confirmBy;

      $scope.formatTime = Utils.formatTime;

      _setupForm();

      $scope.fileName = user._id + "_" + user.profile.name.split(" ").join("_");

      // -------------------------------
      // All this just for dietary restriction checkboxes fml

      var dietaryRestrictions = {
        'Vegetarian': false,
        'Vegan': false,
        'Halal': false,
        'Kosher': false,
        'Nut Allergy': false
      };

      if (user.confirmation.dietaryRestrictions){
        user.confirmation.dietaryRestrictions.forEach(function(restriction){
          if (restriction in dietaryRestrictions){
            dietaryRestrictions[restriction] = true;
          }
        });
      }

      $scope.dietaryRestrictions = dietaryRestrictions;

      // -------------------------------

      function _updateUser(e){
        var confirmation = $scope.user.confirmation;
        // Get the dietary restrictions as an array
        var drs = [];
        Object.keys($scope.dietaryRestrictions).forEach(function(key){
          if ($scope.dietaryRestrictions[key]){
            drs.push(key);
          }
        });
        confirmation.dietaryRestrictions = drs;

        UserService
          .updateConfirmation(user._id, confirmation)
          .success(function(data){
            sweetAlert({
              title: "Woo!",
              text: "You're confirmed!",
              type: "success",
              confirmButtonColor: "#e76482"
            }, function(){
              $state.go('app.dashboard');
            });
          })
          .error(function(res){
            sweetAlert("Uh oh!", "Something went wrong.", "error");
          });
      }

      function _setupForm(){
        // Semantic-UI form validation
        $('.ui.form').form({
          fields: {
            shirt: {
              identifier: 'shirt',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please give us a shirt size!'
                }
              ]
            },
            phone: {
              identifier: 'phone',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter a phone number.'
                }
              ]
            },
            signaturePrivacy: {
              identifier: 'signaturePrivacyPolicy',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please type your digital signature.'
                }
              ]
            },
            signatureLiability: {
              identifier: 'signatureLiabilityWaiver',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please type your digital signature.'
                }
              ]
            },
            signaturePhotoRelease: {
              identifier: 'signaturePhotoRelease',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please type your digital signature.'
                }
              ]
            },
            signatureCodeOfConduct: {
              identifier: 'signatureCodeOfConduct',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please type your digital signature.'
                }
              ]
            },
            signatureMLH: {
              identifier: 'signatureMLH',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please type your digital signature.'
                }
              ]
            },
          }
        });
      }

      $scope.submitForm = function(){
        if ($('.ui.form').form('is valid')){
          _updateUser();
        }
      };

    }]);

angular.module('reg')
  .controller('AdminCtrl', [
    '$scope',
    'UserService',
    function($scope, UserService){
      $scope.loading = true;
    }]);
angular.module('reg')
  .controller('DashboardCtrl', [
    '$rootScope',
    '$scope',
    '$sce',
    'currentUser',
    'settings',
    'Utils',
    'AuthService',
    'UserService',
    'EVENT_INFO',
    'DASHBOARD',
    function($rootScope, $scope, $sce, currentUser, settings, Utils, AuthService, UserService,EVENT_INFO, DASHBOARD){
      var Settings = settings.data;
      var user = currentUser.data;
      $scope.user = user;
      $scope.settings = Settings;
      $scope.DASHBOARD = DASHBOARD;
      
      // Show CheckInOpen Window ---------------------------------------
      var showCheckInOpen = false;
      var todayDate = new Date();

      if ( Settings.checkInAvailable && todayDate.getTime() >= Settings.checkInOpen ) {
        showCheckInOpen = true;
        _populateTeammates();
      }
      
      $scope.showCheckInOpen = showCheckInOpen;
      
      for (var msg in $scope.DASHBOARD) {
        if ($scope.DASHBOARD[msg].includes('[APP_DEADLINE]')) {
          $scope.DASHBOARD[msg] = $scope.DASHBOARD[msg].replace('[APP_DEADLINE]', Utils.formatTime(Settings.timeClose));
        }
        if ($scope.DASHBOARD[msg].includes('[CONFIRM_DEADLINE]')) {
          $scope.DASHBOARD[msg] = $scope.DASHBOARD[msg].replace('[CONFIRM_DEADLINE]', Utils.formatTime(user.status.confirmBy));
        }

      }
        
      // Is registration open?
      var regIsOpen = $scope.regIsOpen = Utils.isRegOpen(Settings);

      // Is it past the user's confirmation time?
      var pastConfirmation = $scope.pastConfirmation = Utils.isAfter(user.status.confirmBy);

      $scope.dashState = function(status){
          
        var user = $scope.user;
        switch (status) {
          case 'unverified':
            return !user.verified;
          case 'openAndIncomplete':
            return regIsOpen && user.verified && !user.status.completedProfile;
          case 'openAndSubmitted':
            return regIsOpen && user.status.completedProfile && !user.status.admitted;
          case 'closedAndIncomplete':
            return !regIsOpen && !user.status.completedProfile && !user.status.admitted;
          case 'closedAndSubmitted': // Waitlisted State
            return !regIsOpen && user.status.completedProfile && !user.status.admitted;
          case 'admittedAndCanConfirm':
            return !pastConfirmation &&
              user.status.admitted &&
              !user.status.confirmed &&
              !user.status.declined;
          case 'admittedAndCannotConfirm':
            return pastConfirmation &&
              user.status.admitted &&
              !user.status.confirmed &&
              !user.status.declined;
          case 'admitted':
            return user.status.admitted && !user.status.declined;
          case 'confirmed':
            return user.status.admitted && user.status.confirmed && !user.status.declined;
          case 'declined':
            return user.status.declined;
        }
        return false;
      };

      $scope.showWaitlist = !regIsOpen && user.status.completedProfile && !user.status.admitted;

      $scope.resendEmail = function(){
        AuthService
          .resendVerificationEmail()
          .then(function(){
            sweetAlert('Your email has been sent.');
          });
      };


      // -----------------------------------------------------
      // Text!
      // -----------------------------------------------------
      var converter = new showdown.Converter();
      $scope.acceptanceText = $sce.trustAsHtml(converter.makeHtml(Settings.acceptanceText));
      $scope.confirmationText = $sce.trustAsHtml(converter.makeHtml(Settings.confirmationText));
      $scope.waitlistText = $sce.trustAsHtml(converter.makeHtml(Settings.waitlistText));


      $scope.declineAdmission = function(){

        swal({
          title: "Whoa!",
          text: "Are you sure you would like to decline your admission? \n\n You can't go back!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, I can't make it.",
          closeOnConfirm: true
          }, function(){

            UserService
              .declineAdmission(user._id)
              .success(function(user){
                $rootScope.currentUser = user;
                $scope.user = user;
              });
        });
      };


      // Ask for location --------------------------------------------------
      $scope.onCheckIn = function () {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              function(data) {
                var coords = data.coords;
                var latitude = coords.latitude;
                var longitude = coords.longitude;
                UserService
                    .makeCheckIn(latitude, longitude)
                    .success(function (user) {
                        swal('You are checked in');
                        $scope.user = user;
                        _populateTeammates();
                    })
                    .error(function(res){
                      $scope.error = res.message;
                    });
              }, function(error) {
                console.log('error :', error);
                $scope.error = error
              },{
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 10000
              });
        } else {
          alert('Geolocation is not supported by this browser.');
        }
      };

      // Ask for team mates ------------------------------------------------
      function _populateTeammates() {
        UserService
            .getMyTeammates()
            .success(function(users){
              $scope.error = null;
              $scope.teammates = users;
              _askForTable(users);
            });
      }
      
      // Ask for table number ----------------------------------------------
      function _askForTable(users) {
        //if the users haven't been assing a table
        if(users.assign && user.status.tableNumber == 'Not assigned') {

            UserService
                .assingTable()
                .success(function (user) {
                    $scope.user = user;
                });
        }
      }
      
    }]);

angular.module('reg')
  .controller('LoginCtrl', [
    '$scope',
    '$http',
    '$state',
    'settings',
    'Utils',
    'AuthService',
    function($scope, $http, $state, settings, Utils, AuthService){

      // Is registration open?
      var Settings = settings.data;
      $scope.regIsOpen = Utils.isRegOpen(Settings);

      // Start state for login
      $scope.loginState = 'login';

      function onSuccess() {
        $state.go('app.dashboard');
      }

      function onError(data){
        $scope.error = data.message;
      }

      function resetError(){
        $scope.error = null;
      }

      $scope.login = function(){
        resetError();
        AuthService.loginWithPassword(
          $scope.email, $scope.password, onSuccess, onError);
      };

      $scope.register = function(){
        resetError();
        AuthService.register(
          $scope.email, $scope.password, onSuccess, onError);
      };

      $scope.setLoginState = function(state) {
        $scope.loginState = state;
      };

      $scope.sendResetEmail = function() {
        var email = $scope.email;
        AuthService.sendResetEmail(email);
        sweetAlert({
          title: "Don't Sweat!",
          text: "An email should be sent to you shortly.",
          type: "success",
          confirmButtonColor: "#e76482"
        });
      };

    }
  ]);

angular.module('reg')
  .controller('SidebarCtrl', [
    '$rootScope',
    '$scope',
    'settings',
    'Utils',
    'AuthService',
    'Session',
    'EVENT_INFO',
    function($rootScope, $scope, Settings, Utils, AuthService, Session, EVENT_INFO){

      var settings = Settings.data;
      var user = $rootScope.currentUser;

      $scope.EVENT_INFO = EVENT_INFO;

      $scope.pastConfirmation = Utils.isAfter(user.status.confirmBy);

      $scope.logout = function(){
        AuthService.logout();
      };

      $scope.showSidebar = false;
      $scope.toggleSidebar = function(){
        $scope.showSidebar = !$scope.showSidebar;
      };

      // oh god jQuery hack
      $('.item').on('click', function(){
        $scope.showSidebar = false;
      });

    }]);

angular.module('reg')
  .controller('ResetCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'AuthService',
    function($scope, $stateParams, $state, AuthService){
      var token = $stateParams.token;

      $scope.loading = true;

      $scope.changePassword = function(){
        var password = $scope.password;
        var confirm = $scope.confirm;

        if (password !== confirm){
          $scope.error = "Passwords don't match!";
          $scope.confirm = "";
          return;
        }

        AuthService.resetPassword(
          token,
          $scope.password,
          function(message){
            sweetAlert({
              title: "Neato!",
              text: "Your password has been changed!",
              type: "success",
              confirmButtonColor: "#e76482"
            }, function(){
              $state.go('login');
            });
          },
          function(data){
            $scope.error = data.message;
            $scope.loading = false;
          });
      };

    }]);
angular.module('reg')
  .controller('VerifyCtrl', [
    '$scope',
    '$stateParams',
    'AuthService',
    function($scope, $stateParams, AuthService){
      var token = $stateParams.token;

      $scope.loading = true;

      if (token){
        AuthService.verify(token,
          function(user){
            $scope.success = true;

            $scope.loading = false;
          },
          function(err){

            $scope.loading = false;
          });
      }

    }]);
angular.module('reg')
  .controller('WorkshopsCtrl', [
    '$rootScope',
    '$scope',
    '$sce',
    'currentUser',
    'settings',
    'Utils',
    'AuthService',
    'UserService',
    'EVENT_INFO',
    'DASHBOARD',
    function($rootScope, $scope, $sce, currentUser, settings, Utils, AuthService, UserService, DASHBOARD){
      var Settings = settings.data;
      var user = currentUser.data;
      $scope.user = user;

      $scope.DASHBOARD = DASHBOARD;
      
      for (var msg in $scope.DASHBOARD) {
        if ($scope.DASHBOARD[msg].includes('[APP_DEADLINE]')) {
          $scope.DASHBOARD[msg] = $scope.DASHBOARD[msg].replace('[APP_DEADLINE]', Utils.formatTime(Settings.timeClose));
        }
        if ($scope.DASHBOARD[msg].includes('[CONFIRM_DEADLINE]')) {
          $scope.DASHBOARD[msg] = $scope.DASHBOARD[msg].replace('[CONFIRM_DEADLINE]', Utils.formatTime(user.status.confirmBy));
        }
      }

      // Is registration open?
      var regIsOpen = $scope.regIsOpen = Utils.isRegOpen(Settings);

      // Is it past the user's confirmation time?
      var pastConfirmation = $scope.pastConfirmation = Utils.isAfter(user.status.confirmBy);

      $scope.dashState = function(status){
        var user = $scope.user;
        switch (status) {
          case 'unverified':
            return !user.verified;
          case 'openAndIncomplete':
            return regIsOpen && user.verified && !user.status.completedProfile;
          case 'openAndSubmitted':
            return regIsOpen && user.status.completedProfile && !user.status.admitted;
          case 'closedAndIncomplete':
            return !regIsOpen && !user.status.completedProfile && !user.status.admitted;
          case 'closedAndSubmitted': // Waitlisted State
            return !regIsOpen && user.status.completedProfile && !user.status.admitted;
          case 'admittedAndCanConfirm':
            return !pastConfirmation &&
              user.status.admitted &&
              !user.status.confirmed &&
              !user.status.declined;
          case 'admittedAndCannotConfirm':
            return pastConfirmation &&
              user.status.admitted &&
              !user.status.confirmed &&
              !user.status.declined;
          case 'confirmed':
            return user.status.admitted && user.status.confirmed && !user.status.declined;
          case 'declined':
            return user.status.declined;
        }
        return false;
      };

      $scope.showWaitlist = !regIsOpen && user.status.completedProfile && !user.status.admitted;

      $scope.resendEmail = function(){
        AuthService
          .resendVerificationEmail()
          .then(function(){
            sweetAlert('Your email has been sent.');
          });
      };


      // -----------------------------------------------------
      // Text!
      // -----------------------------------------------------
      var converter = new showdown.Converter();
      $scope.acceptanceText = $sce.trustAsHtml(converter.makeHtml(Settings.acceptanceText));
      $scope.confirmationText = $sce.trustAsHtml(converter.makeHtml(Settings.confirmationText));
      $scope.waitlistText = $sce.trustAsHtml(converter.makeHtml(Settings.waitlistText));


      $scope.declineAdmission = function(){

        swal({
          title: "Whoa!",
          text: "Are you sure you would like to decline your admission? \n\n You can't go back!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, I can't make it.",
          closeOnConfirm: true
          }, function(){

            UserService
              .declineAdmission(user._id)
              .success(function(user){
                $rootScope.currentUser = user;
                $scope.user = user;
              });
        });
      };

    }]);

angular.module('reg')
  .controller('TeamCtrl', [
    '$scope',
    'currentUser',
    'settings',
    'Utils',
    'UserService',
    'TEAM',
    function($scope, currentUser, settings, Utils, UserService, TEAM){
      // Get the current user's most recent data.
      var Settings = settings.data;

      $scope.regIsOpen = Utils.isRegOpen(Settings);

      $scope.user = currentUser.data;

      $scope.TEAM = TEAM;

      function _populateTeammates() {
        UserService
          .getMyTeammates()
          .success(function(data){
            $scope.error = null;
            $scope.teammates = data.teammates;
          });
      }

      if ($scope.user.teamCode){
        _populateTeammates();
      }

      $scope.joinTeam = function(){
        if($scope.code && $scope.code != ''){
          UserService
            .joinOrCreateTeam($scope.code)
            .success(function(user){
              $scope.error = null;
              $scope.user = user;
              _populateTeammates();
            })
            .error(function(res){
              $scope.error = res.message;
            });
        } else {
          $scope.error = "Please enter a team name"
        }
      };

      $scope.leaveTeam = function(){
        UserService
          .leaveTeam()
          .success(function(user){
            $scope.error = null;
            $scope.user = user;
            $scope.teammates = [];
          })
          .error(function(res){
            $scope.error = res.data.message;
          });
      };

    }]);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnN0YW50cy5qcyIsInJvdXRlcy5qcyIsImludGVyY2VwdG9ycy9BdXRoSW50ZXJjZXB0b3IuanMiLCJtb2R1bGVzL1Nlc3Npb24uanMiLCJtb2R1bGVzL1V0aWxzLmpzIiwic2VydmljZXMvQXV0aFNlcnZpY2UuanMiLCJzZXJ2aWNlcy9TZXR0aW5nc1NlcnZpY2UuanMiLCJzZXJ2aWNlcy9Vc2VyU2VydmljZS5qcyIsImFkbWluL3NldHRpbmdzL2FkbWluU2V0dGluZ3NDdHJsLmpzIiwiYWRtaW4vdXNlci9hZG1pblVzZXJDdHJsLmpzIiwiYWRtaW4vc3RhdHMvYWRtaW5TdGF0c0N0cmwuanMiLCJhZG1pbi91c2Vycy9hZG1pblVzZXJzQ3RybC5qcyIsImFwcGxpY2F0aW9uL2FwcGxpY2F0aW9uQ3RybC5qcyIsImNoYWxsZW5nZXMvY2hhbGxlbmdlc0N0cmwuanMiLCJjb25maXJtYXRpb24vY29uZmlybWF0aW9uQ3RybC5qcyIsImFkbWluL2FkbWluQ3RybC5qcyIsImRhc2hib2FyZC9kYXNoYm9hcmRDdHJsLmpzIiwibG9naW4vbG9naW5DdHJsLmpzIiwic2lkZWJhci9zaWRlYmFyQ3RybC5qcyIsInJlc2V0L3Jlc2V0Q3RybC5qcyIsInZlcmlmeS92ZXJpZnlDdHJsLmpzIiwid29ya3Nob3BzL3dvcmtzaG9wc0N0cmwuanMiLCJ0ZWFtL3RlYW1DdHJsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsTUFBQSxRQUFBLE9BQUEsT0FBQTtFQUNBOzs7QUFHQTtHQUNBLE9BQUE7SUFDQTtJQUNBLFNBQUEsY0FBQTs7O01BR0EsY0FBQSxhQUFBLEtBQUE7OztHQUdBLElBQUE7SUFDQTtJQUNBO0lBQ0EsU0FBQSxhQUFBLFFBQUE7OztNQUdBLElBQUEsUUFBQSxRQUFBO01BQ0EsSUFBQSxNQUFBO1FBQ0EsWUFBQSxlQUFBOzs7Ozs7QUNyQkEsTUFBQSxRQUFBLElBQUE7QUFDQSxRQUFBLE9BQUE7S0FDQSxTQUFBLGNB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O1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBO1FBQ0EsTUFBQTtVQUNBLGNBQUE7OztPQUdBLE1BQUEsVUFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLE1BQUE7VUFDQSxjQUFBOzs7T0FHQSxNQUFBLE9BQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUE7VUFDQSxjQUFBOzs7O0lBSUEsa0JBQUEsVUFBQTtNQUNBLFNBQUE7Ozs7R0FJQSxJQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7TUFDQTtNQUNBO01BQ0EsU0FBQTs7TUFFQSxXQUFBLElBQUEsdUJBQUEsV0FBQTtTQUNBLFNBQUEsS0FBQSxZQUFBLFNBQUEsZ0JBQUEsWUFBQTs7O01BR0EsV0FBQSxJQUFBLHFCQUFBLFVBQUEsT0FBQSxTQUFBLFVBQUE7UUFDQSxJQUFBLGVBQUEsUUFBQSxLQUFBO1FBQ0EsSUFBQSxlQUFBLFFBQUEsS0FBQTtRQUNBLElBQUEsa0JBQUEsUUFBQSxLQUFBOztRQUVBLElBQUEsZ0JBQUEsQ0FBQSxRQUFBLFlBQUE7VUFDQSxNQUFBO1VBQ0EsT0FBQSxHQUFBOzs7UUFHQSxJQUFBLGdCQUFBLENBQUEsUUFBQSxVQUFBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsT0FBQSxHQUFBOzs7UUFHQSxJQUFBLG1CQUFBLENBQUEsUUFBQSxVQUFBLFNBQUE7VUFDQSxNQUFBO1VBQ0EsT0FBQSxHQUFBOzs7Ozs7O0FDek9BLFFBQUEsT0FBQTtHQUNBLFFBQUEsbUJBQUE7SUFDQTtJQUNBLFNBQUEsUUFBQTtNQUNBLE9BQUE7VUFDQSxTQUFBLFNBQUEsT0FBQTtZQUNBLElBQUEsUUFBQSxRQUFBO1lBQ0EsSUFBQSxTQUFBLE9BQUEsSUFBQSxPQUFBLGNBQUEsQ0FBQSxFQUFBO2NBQ0EsT0FBQSxRQUFBLG9CQUFBOztZQUVBLE9BQUE7Ozs7O0FDVkEsUUFBQSxPQUFBO0dBQ0EsUUFBQSxXQUFBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsWUFBQSxRQUFBOztJQUVBLEtBQUEsU0FBQSxTQUFBLE9BQUEsS0FBQTtNQUNBLFFBQUEsYUFBQSxNQUFBO01BQ0EsUUFBQSxhQUFBLFNBQUEsS0FBQTtNQUNBLFFBQUEsYUFBQSxjQUFBLEtBQUEsVUFBQTtNQUNBLFdBQUEsY0FBQTs7O0lBR0EsS0FBQSxVQUFBLFNBQUEsV0FBQTtNQUNBLE9BQUEsUUFBQSxhQUFBO01BQ0EsT0FBQSxRQUFBLGFBQUE7TUFDQSxPQUFBLFFBQUEsYUFBQTtNQUNBLFdBQUEsY0FBQTtNQUNBLElBQUEsV0FBQTtRQUNBOzs7O0lBSUEsS0FBQSxXQUFBLFVBQUE7TUFDQSxPQUFBLFFBQUEsYUFBQTs7O0lBR0EsS0FBQSxZQUFBLFVBQUE7TUFDQSxPQUFBLFFBQUEsYUFBQTs7O0lBR0EsS0FBQSxVQUFBLFVBQUE7TUFDQSxPQUFBLEtBQUEsTUFBQSxRQUFBLGFBQUE7OztJQUdBLEtBQUEsVUFBQSxTQUFBLEtBQUE7TUFDQSxRQUFBLGFBQUEsY0FBQSxLQUFBLFVBQUE7TUFDQSxXQUFBLGNBQUE7Ozs7QUNyQ0EsUUFBQSxPQUFBO0dBQ0EsUUFBQSxTQUFBO0lBQ0EsVUFBQTtNQUNBLE9BQUE7UUFDQSxXQUFBLFNBQUEsU0FBQTtVQUNBLE9BQUEsS0FBQSxRQUFBLFNBQUEsWUFBQSxLQUFBLFFBQUEsU0FBQTs7UUFFQSxTQUFBLFNBQUEsS0FBQTtVQUNBLE9BQUEsS0FBQSxRQUFBOztRQUVBLFlBQUEsU0FBQSxLQUFBOztVQUVBLElBQUEsQ0FBQSxLQUFBO1lBQ0EsT0FBQTs7O1VBR0EsT0FBQSxJQUFBLEtBQUE7VUFDQSxJQUFBLFdBQUEsT0FBQSxHQUFBO1VBQ0EsSUFBQSxpQkFBQSxLQUFBOzs7VUFHQSxPQUFBLE9BQUEsTUFBQSxPQUFBO1lBQ0EsTUFBQSxPQUFBLEdBQUEsS0FBQSxVQUFBLEtBQUE7Ozs7O0FDdEJBLFFBQUEsT0FBQTtHQUNBLFFBQUEsZUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLE9BQUEsWUFBQSxRQUFBLFNBQUEsU0FBQTtNQUNBLElBQUEsY0FBQTs7TUFFQSxTQUFBLGFBQUEsTUFBQSxHQUFBOztRQUVBLFFBQUEsT0FBQSxLQUFBLE9BQUEsS0FBQTs7UUFFQSxJQUFBLEdBQUE7VUFDQSxHQUFBLEtBQUE7Ozs7TUFJQSxTQUFBLGFBQUEsTUFBQSxHQUFBO1FBQ0EsT0FBQSxHQUFBO1FBQ0EsSUFBQSxJQUFBO1VBQ0EsR0FBQTs7OztNQUlBLFlBQUEsb0JBQUEsU0FBQSxPQUFBLFVBQUEsV0FBQSxXQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsZUFBQTtZQUNBLE9BQUE7WUFDQSxVQUFBOztXQUVBLFFBQUEsU0FBQSxLQUFBO1lBQ0EsYUFBQSxNQUFBOztXQUVBLE1BQUEsU0FBQSxLQUFBO1lBQ0EsYUFBQSxNQUFBOzs7O01BSUEsWUFBQSxpQkFBQSxTQUFBLE9BQUEsV0FBQSxVQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsZUFBQTtZQUNBLE9BQUE7O1dBRUEsUUFBQSxTQUFBLEtBQUE7WUFDQSxhQUFBLE1BQUE7O1dBRUEsTUFBQSxTQUFBLE1BQUEsV0FBQTtZQUNBLElBQUEsZUFBQSxJQUFBO2NBQ0EsUUFBQSxRQUFBOzs7OztNQUtBLFlBQUEsU0FBQSxTQUFBLFVBQUE7O1FBRUEsUUFBQSxRQUFBO1FBQ0EsT0FBQSxHQUFBOzs7TUFHQSxZQUFBLFdBQUEsU0FBQSxPQUFBLFVBQUEsV0FBQSxXQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsa0JBQUE7WUFDQSxPQUFBO1lBQ0EsVUFBQTs7V0FFQSxRQUFBLFNBQUEsS0FBQTtZQUNBLGFBQUEsTUFBQTs7V0FFQSxNQUFBLFNBQUEsS0FBQTtZQUNBLGFBQUEsTUFBQTs7OztNQUlBLFlBQUEsU0FBQSxTQUFBLE9BQUEsV0FBQSxXQUFBO1FBQ0EsT0FBQTtXQUNBLElBQUEsa0JBQUE7V0FDQSxRQUFBLFNBQUEsS0FBQTtZQUNBLFFBQUEsUUFBQTtZQUNBLElBQUEsVUFBQTtjQUNBLFVBQUE7OztXQUdBLE1BQUEsU0FBQSxLQUFBO1lBQ0EsSUFBQSxXQUFBO2NBQ0EsVUFBQTs7Ozs7TUFLQSxZQUFBLDBCQUFBLFNBQUEsV0FBQSxVQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsdUJBQUE7WUFDQSxJQUFBLFFBQUE7Ozs7TUFJQSxZQUFBLGlCQUFBLFNBQUEsTUFBQTtRQUNBLE9BQUE7V0FDQSxLQUFBLGVBQUE7WUFDQSxPQUFBOzs7O01BSUEsWUFBQSxnQkFBQSxTQUFBLE9BQUEsTUFBQSxXQUFBLFVBQUE7UUFDQSxPQUFBO1dBQ0EsS0FBQSx3QkFBQTtZQUNBLE9BQUE7WUFDQSxVQUFBOztXQUVBLFFBQUE7V0FDQSxNQUFBOzs7TUFHQSxPQUFBOzs7QUNuSEEsUUFBQSxPQUFBO0dBQ0EsUUFBQSxtQkFBQTtFQUNBO0VBQ0EsU0FBQSxNQUFBOztJQUVBLElBQUEsT0FBQTs7SUFFQSxPQUFBO01BQ0EsbUJBQUEsVUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBOztNQUVBLHlCQUFBLFNBQUEsTUFBQSxNQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxTQUFBO1VBQ0EsVUFBQTtVQUNBLFdBQUE7OztNQUdBLHdCQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsY0FBQTtVQUNBLE1BQUE7OztNQUdBLHNCQUFBLFVBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBOztNQUVBLHlCQUFBLFNBQUEsT0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsYUFBQTtVQUNBLFFBQUE7OztNQUdBLG9CQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsWUFBQTtVQUNBLE1BQUE7OztNQUdBLHNCQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsY0FBQTtVQUNBLE1BQUE7OztNQUdBLHdCQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsZ0JBQUE7VUFDQSxNQUFBOzs7TUFHQSxtQkFBQSxTQUFBLE9BQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLGVBQUE7VUFDQSxhQUFBOzs7TUFHQSx3QkFBQSxVQUFBLFFBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLG9CQUFBO1VBQ0Esa0JBQUE7OztNQUdBLG9CQUFBLFVBQUEsVUFBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxnQkFBQTtVQUNBLFVBQUE7VUFDQSxXQUFBOzs7TUFHQSxxQkFBQSxVQUFBLFFBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLGlCQUFBO1VBQ0EsZUFBQTs7Ozs7Ozs7QUMvREEsUUFBQSxPQUFBO0dBQ0EsUUFBQSxlQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxPQUFBLFNBQUEsUUFBQTs7TUFFQSxJQUFBLFFBQUE7TUFDQSxJQUFBLE9BQUEsUUFBQTs7TUFFQSxTQUFBLHNCQUFBLEdBQUE7O01BRUEsSUFBQSxnQkFBQTs7UUFFQSxPQUFBLEtBQUEsVUFBQSxHQUFBLFFBQUE7VUFDQSxTQUFBLEdBQUE7WUFDQSxPQUFBLE1BQUEsQ0FBQSxNQUFBLEVBQUEsV0FBQSxHQUFBLFNBQUEsS0FBQSxNQUFBLENBQUE7Ozs7O0lBS0EsT0FBQTs7Ozs7TUFLQSxnQkFBQSxVQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxRQUFBOzs7TUFHQSxLQUFBLFNBQUEsR0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7OztNQUdBLFFBQUEsVUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBOzs7TUFHQSxTQUFBLFNBQUEsTUFBQSxNQUFBLEtBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxRQUFBLE1BQUEsRUFBQTtVQUNBO1lBQ0EsTUFBQTtZQUNBLE1BQUEsT0FBQSxPQUFBO1lBQ0EsTUFBQSxPQUFBLE9BQUE7Ozs7O01BS0EsZUFBQSxTQUFBLElBQUEsUUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsS0FBQSxZQUFBO1VBQ0EsU0FBQTs7OztNQUlBLGNBQUEsU0FBQSxJQUFBLEtBQUE7UUFDQSxJQUFBLE1BQUEsS0FBQSxLQUFBLE1BQUEsS0FBQSxLQUFBLEtBQUEsTUFBQSxLQUFBLFNBQUE7UUFDQSxNQUFBO1VBQ0EsUUFBQTtVQUNBLEtBQUE7VUFDQSxNQUFBO1VBQ0EsVUFBQTtZQUNBLGtCQUFBLFlBQUE7WUFDQSxpQkFBQTtZQUNBLG9CQUFBLHNCQUFBO2NBQ0EsU0FBQSxNQUFBLEtBQUEsTUFBQTtjQUNBLFNBQUE7Y0FDQSxlQUFBO2NBQ0EsU0FBQTs7O1dBR0EsUUFBQSxTQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUE7VUFDQSxRQUFBLElBQUE7VUFDQSxRQUFBLElBQUE7V0FDQSxNQUFBLFNBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQTtVQUNBLFFBQUEsSUFBQSxhQUFBOzs7O01BSUEsb0JBQUEsU0FBQSxJQUFBLGFBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLEtBQUEsWUFBQTtVQUNBLGNBQUE7Ozs7TUFJQSxrQkFBQSxTQUFBLEdBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7OztNQUdBLGFBQUEsU0FBQSxVQUFBLFdBQUE7UUFDQSxjQUFBO1VBQ0EsVUFBQTtVQUNBLFdBQUE7O1FBRUEsT0FBQSxNQUFBLEtBQUEsT0FBQSxRQUFBLGNBQUEsc0JBQUEsRUFBQSxZQUFBOzs7Ozs7TUFNQSxrQkFBQSxTQUFBLEtBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLFFBQUEsY0FBQSxTQUFBO1VBQ0EsTUFBQTs7OztNQUlBLFdBQUEsVUFBQTtRQUNBLE9BQUEsTUFBQSxPQUFBLE9BQUEsUUFBQSxjQUFBOzs7TUFHQSxnQkFBQSxVQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxRQUFBLGNBQUE7OztNQUdBLGFBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSxNQUFBLE9BQUEsUUFBQSxjQUFBOzs7Ozs7O01BT0EsVUFBQSxVQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTs7O01BR0EsV0FBQSxTQUFBLEdBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7OztNQUdBLFNBQUEsU0FBQSxHQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7TUFHQSxVQUFBLFNBQUEsR0FBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O01BR0EsYUFBQSxTQUFBLFVBQUEsYUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLGdCQUFBLFdBQUEsVUFBQTtVQUNBLGFBQUE7Ozs7Ozs7QUMzSUEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxxQkFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxNQUFBLGdCQUFBOztNQUVBLE9BQUEsV0FBQTtNQUNBO1NBQ0E7U0FDQSxRQUFBLFNBQUEsU0FBQTtVQUNBLGVBQUE7OztNQUdBLFNBQUEsZUFBQSxTQUFBO1FBQ0EsT0FBQSxVQUFBO1FBQ0EsU0FBQSxXQUFBLElBQUEsS0FBQSxTQUFBO1FBQ0EsU0FBQSxZQUFBLElBQUEsS0FBQSxTQUFBO1FBQ0EsU0FBQSxjQUFBLElBQUEsS0FBQSxTQUFBO1FBQ0EsU0FBQSxjQUFBLElBQUEsS0FBQSxTQUFBOztRQUVBLE9BQUEsV0FBQTs7Ozs7TUFLQTtTQUNBO1NBQ0EsUUFBQSxTQUFBLE9BQUE7VUFDQSxPQUFBLFlBQUEsT0FBQSxLQUFBOzs7TUFHQSxPQUFBLGtCQUFBLFVBQUE7UUFDQTtXQUNBLHdCQUFBLE9BQUEsVUFBQSxRQUFBLE1BQUEsSUFBQSxNQUFBO1dBQ0EsUUFBQSxTQUFBLFNBQUE7WUFDQSxLQUFBO1lBQ0EsT0FBQSxZQUFBLFNBQUEsa0JBQUEsS0FBQTs7Ozs7O01BTUEsT0FBQSxhQUFBLFNBQUEsS0FBQTtRQUNBLElBQUEsQ0FBQSxLQUFBO1VBQ0EsT0FBQTs7O1FBR0EsSUFBQSxXQUFBLE9BQUEsR0FBQTtRQUNBLElBQUEsaUJBQUEsS0FBQTs7O1FBR0EsT0FBQSxPQUFBLE1BQUEsT0FBQTtVQUNBLE1BQUEsT0FBQSxHQUFBLEtBQUEsVUFBQSxLQUFBOzs7O01BSUEsU0FBQSxVQUFBLEtBQUE7UUFDQSxPQUFBLElBQUE7VUFDQSxLQUFBO1VBQ0EsS0FBQTtVQUNBLEtBQUE7VUFDQSxLQUFBO1VBQ0EsS0FBQTs7OztNQUlBLE9BQUEsMEJBQUEsVUFBQTs7UUFFQSxJQUFBLE9BQUEsVUFBQSxPQUFBLFNBQUEsVUFBQTtRQUNBLElBQUEsUUFBQSxVQUFBLE9BQUEsU0FBQSxXQUFBOztR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QUFBO2dCQUNBLE9BQUEsS0FBQSxZQUFBOzs7WUFHQTtZQUNBLE1BQUE7WUFDQSxRQUFBO2NBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsUUFBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxRQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLFFBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsUUFBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxRQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLFFBQUE7OztZQUdBO1lBQ0EsTUFBQTtZQUNBLFFBQUE7Y0FDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxhQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLGFBQUEsb0JBQUEsS0FBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxhQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLGFBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxhQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLGFBQUE7Z0JBQ0EsTUFBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxhQUFBOzs7WUFHQTtZQUNBLE1BQUE7WUFDQSxRQUFBO2NBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQTtnQkFDQSxNQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLGFBQUE7Z0JBQ0EsTUFBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxhQUFBO2dCQUNBLE1BQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQTtnQkFDQSxNQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLGFBQUE7Z0JBQ0EsTUFB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QUFBLE9BQUEsVUFBQSxLQUFBLFNBQUEsbUJBQUE7VUFDQSxPQUFBLFVBQUEsT0FBQSxPQUFBLFVBQUEsS0FBQSxRQUFBLGtCQUFBLE1BQUEsV0FBQSxTQUFBOztRQUVBLElBQUEsT0FBQSxVQUFBLEtBQUEsU0FBQSx1QkFBQTtVQUNBLE9BQUEsVUFBQSxPQUFBLE9BQUEsVUFBQSxLQUFBLFFBQUEsc0JBQUEsTUFBQSxXQUFBLEtBQUEsT0FBQTs7Ozs7TUFLQSxJQUFBLFlBQUEsT0FBQSxZQUFBLE1BQUEsVUFBQTs7O01BR0EsSUFBQSxtQkFBQSxPQUFBLG1CQUFBLE1BQUEsUUFBQSxLQUFBLE9BQUE7O01BRUEsT0FBQSxZQUFBLFNBQUEsT0FBQTtRQUNBLElBQUEsT0FBQSxPQUFBO1FBQ0EsUUFBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLENBQUEsS0FBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLGFBQUEsS0FBQSxZQUFBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsYUFBQSxLQUFBLE9BQUEsb0JBQUEsQ0FBQSxLQUFBLE9BQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxDQUFBLGFBQUEsQ0FBQSxLQUFBLE9BQUEsb0JBQUEsQ0FBQSxLQUFBLE9BQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxDQUFBLGFBQUEsS0FBQSxPQUFBLG9CQUFBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsQ0FBQTtjQUNBLEtBQUEsT0FBQTtjQUNBLENBQUEsS0FBQSxPQUFBO2NBQ0EsQ0FBQSxLQUFBLE9BQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQTtjQUNBLEtBQUEsT0FBQTtjQUNBLENBQUEsS0FBQSxPQUFBO2NBQ0EsQ0FBQSxLQUFBLE9BQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxLQUFBLE9BQUEsWUFBQSxLQUFBLE9BQUEsYUFBQSxDQUFBLEtBQUEsT0FBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLEtBQUEsT0FBQTs7UUFFQSxPQUFBOzs7TUFHQSxPQUFBLGVBQUEsQ0FBQSxhQUFBLEtBQUEsT0FBQSxvQkFBQSxDQUFBLEtBQUEsT0FBQTs7TUFFQSxPQUFBLGNBQUEsVUFBQTtRQUNBO1dBQ0E7V0FDQSxLQUFBLFVBQUE7WUFDQSxXQUFBOzs7Ozs7OztNQVFBLElBQUEsWUFBQSxJQUFBLFNBQUE7TUFDQSxPQUFBLGlCQUFBLEtBQUEsWUFBQSxVQUFBLFNBQUEsU0FBQTtNQUNBLE9BQUEsbUJBQUEsS0FBQSxZQUFBLFVBQUEsU0FBQSxTQUFBO01BQ0EsT0FBQSxlQUFBLEtBQUEsWUFBQSxVQUFBLFNBQUEsU0FBQTs7O01BR0EsT0FBQSxtQkFBQSxVQUFBOztRQUVBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLE1BQUE7VUFDQSxrQkFBQTtVQUNBLG9CQUFBO1VBQ0EsbUJBQUE7VUFDQSxnQkFBQTthQUNBLFVBQUE7O1lBRUE7ZUFDQSxpQkFBQSxLQUFBO2VBQ0EsUUFBQSxTQUFBLEtBQUE7Z0JBQ0EsV0FBQSxjQUFBO2dCQUNBLE9BQUEsT0FBQTs7Ozs7OztBQ3JHQSxRQUFBLE9BQUE7R0FDQSxXQUFBLG9CQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsWUFBQSxRQUFBLGFBQUEsT0FBQSxhQUFBLFNBQUE7OztNQUdBLElBQUEsT0FBQSxZQUFBO01BQ0EsT0FBQSxPQUFBOzs7TUFHQSxJQUFBLFdBQUEsU0FBQTtNQUNBLE9BQUEsZ0JBQUEsU0FBQTs7TUFFQSxPQUFBLG1CQUFBLEtBQUEsUUFBQSxLQUFBLE9BQUE7O01BRUEsT0FBQSxhQUFBLE1BQUE7O01BRUE7O01BRUEsT0FBQSxXQUFBLEtBQUEsTUFBQSxNQUFBLEtBQUEsUUFBQSxLQUFBLE1BQUEsS0FBQSxLQUFBOzs7OztNQUtBLElBQUEsc0JBQUE7UUFDQSxjQUFBO1FBQ0EsU0FBQTtRQUNBLFNBQUE7UUFDQSxVQUFBO1FBQ0EsZUFBQTs7O01BR0EsSUFBQSxLQUFBLGFBQUEsb0JBQUE7UUFDQSxLQUFBLGFBQUEsb0JBQUEsUUFBQSxTQUFBLFlBQUE7VUFDQSxJQUFBLGVBQUEsb0JBQUE7WUFDQSxvQkFBQSxlQUFBOzs7OztNQUtBLE9BQUEsc0JBQUE7Ozs7TUFJQSxTQUFBLFlBQUEsRUFBQTtRQUNBLElBQUEsZUFBQSxPQUFBLEtBQUE7O1FBRUEsSUFBQSxNQUFBO1FBQ0EsT0FBQSxLQUFBLE9BQUEscUJBQUEsUUFBQSxTQUFBLElBQUE7VUFDQSxJQUFBLE9BQUEsb0JBQUEsS0FBQTtZQUNBLElBQUEsS0FBQTs7O1FBR0EsYUFBQSxzQkFBQTs7UUFFQTtXQUNBLG1CQUFBLEtBQUEsS0FBQTtXQUNBLFFBQUEsU0FBQSxLQUFBO1lBQ0EsV0FBQTtjQUNBLE9BQUE7Y0FDQSxNQUFBO2NBQ0EsTUFBQTtjQUNBLG9CQUFBO2VBQ0EsVUFBQTtjQUNBLE9BQUEsR0FBQTs7O1dBR0EsTUFBQSxTQUFBLElBQUE7WUFDQSxXQUFBLFVBQUEseUJBQUE7Ozs7TUFJQSxTQUFBLFlBQUE7O1FBRUEsRUFBQSxZQUFBLEtBQUE7VUFDQSxRQUFBO1lBQ0EsT0FBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLE9BQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxrQkFBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLG9CQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsdUJBQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSx3QkFBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLGNBQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7Ozs7O01BUUEsT0FBQSxhQUFBLFVBQUE7UUFDQSxJQUFBLEVBQUEsWUFBQSxLQUFBLFlBQUE7VUFDQTs7Ozs7O0FDdkpBLFFBQUEsT0FBQTtHQUNBLFdBQUEsYUFBQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsWUFBQTtNQUNBLE9BQUEsVUFBQTs7QUNMQSxRQUFBLE9BQUE7R0FDQSxXQUFBLGlCQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFlBQUEsUUFBQSxNQUFBLGFBQUEsVUFBQSxPQUFBLGFBQUEsWUFBQSxZQUFBLFVBQUE7TUFDQSxJQUFBLFdBQUEsU0FBQTtNQUNBLElBQUEsT0FBQSxZQUFBO01BQ0EsT0FBQSxPQUFBO01BQ0EsT0FBQSxXQUFBO01BQ0EsT0FBQSxZQUFBOzs7TUFHQSxJQUFBLGtCQUFBO01BQ0EsSUFBQSxZQUFBLElBQUE7O01BRUEsS0FBQSxTQUFBLG9CQUFBLFVBQUEsYUFBQSxTQUFBLGNBQUE7UUFDQSxrQkFBQTtRQUNBOzs7TUFHQSxPQUFBLGtCQUFBOztNQUVBLEtBQUEsSUFBQSxPQUFBLE9BQUEsV0FBQTtRQUNBLElBQUEsT0FBQSxVQUFBLEtBQUEsU0FBQSxtQkFBQTtVQUNBLE9BQUEsVUFBQSxPQUFBLE9BQUEsVUFBQSxLQUFBLFFBQUEsa0JBQUEsTUFBQSxXQUFBLFNBQUE7O1FBRUEsSUFBQSxPQUFBLFVBQUEsS0FBQSxTQUFBLHVCQUFBO1VBQ0EsT0FBQSxVQUFBLE9BQUEsT0FBQSxVQUFBLEtBQUEsUUFBQSxzQkFBQSxNQUFBLFdBQUEsS0FBQSxPQUFBOzs7Ozs7TUFNQSxJQUFBLFlBQUEsT0FBQSxZQUFBLE1BQUEsVUFBQTs7O01BR0EsSUFBQSxtQkFBQSxPQUFBLG1CQUFBLE1BQUEsUUFBQSxLQUFBLE9BQUE7O01BRUEsT0FBQSxZQUFBLFNBQUEsT0FBQTs7UUFFQSxJQUFBLE9BQUEsT0FBQTtRQUNBLFFBQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxDQUFBLEtBQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxhQUFBLEtBQUEsWUFBQSxDQUFBLEtBQUEsT0FBQTtVQUNBLEtBQUE7WUFDQSxP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QSxRQUFBO1lBQ0EsV0FBQTtjQUNBLE9BQUE7Y0FDQSxNQUFBO2NBQ0EsTUFBQTtjQUNBLG9CQUFBO2VBQ0EsVUFBQTtjQUNBLE9BQUEsR0FBQTs7O1VBR0EsU0FBQSxLQUFBO1lBQ0EsT0FBQSxRQUFBLEtBQUE7WUFDQSxPQUFBLFVBQUE7Ozs7O0FDcENBLFFBQUEsT0FBQTtHQUNBLFdBQUEsY0FBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxjQUFBLFlBQUE7TUFDQSxJQUFBLFFBQUEsYUFBQTs7TUFFQSxPQUFBLFVBQUE7O01BRUEsSUFBQSxNQUFBO1FBQ0EsWUFBQSxPQUFBO1VBQ0EsU0FBQSxLQUFBO1lBQ0EsT0FBQSxVQUFBOztZQUVBLE9BQUEsVUFBQTs7VUFFQSxTQUFBLElBQUE7O1lBRUEsT0FBQSxVQUFBOzs7OztBQ25CQSxRQUFBLE9BQUE7R0FDQSxXQUFBLGlCQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFlBQUEsUUFBQSxNQUFBLGFBQUEsVUFBQSxPQUFBLGFBQUEsYUFBQSxVQUFBO01BQ0EsSUFBQSxXQUFBLFNBQUE7TUFDQSxJQUFBLE9BQUEsWUFBQTtNQUNBLE9BQUEsT0FBQTs7TUFFQSxPQUFBLFlBQUE7O01BRUEsS0FBQSxJQUFBLE9BQUEsT0FBQSxXQUFBO1FBQ0EsSUFBQSxPQUFBLFVBQUEsS0FBQSxTQUFBLG1CQUFBO1VBQ0EsT0FBQSxVQUFBLE9BQUEsT0FBQSxVQUFBLEtBQUEsUUFBQSxrQkFBQSxNQUFBLFdBQUEsU0FBQTs7UUFFQSxJQUFBLE9BQUEsVUFBQSxLQUFBLFNBQUEsdUJBQUE7VUFDQSxPQUFBLFVBQUEsT0FBQSxPQUFBLFVBQUEsS0FBQSxRQUFBLHNCQUFBLE1BQUEsV0FBQSxLQUFBLE9BQUE7Ozs7O01BS0EsSUFBQSxZQUFBLE9BQUEsWUFBQSxNQUFBLFVBQUE7OztNQUdBLElBQUEsbUJBQUEsT0FBQSxtQkFBQSxNQUFBLFFBQUEsS0FBQSxPQUFBOztNQUVBLE9BQUEsWUFBQSxTQUFBLE9BQUE7UUFDQSxJQUFBLE9BQUEsT0FBQTtRQUNBLFFBQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxDQUFBLEtBQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxhQUFBLEtBQUEsWUFBQSxDQUFBLEtBQUEsT0FBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLGFBQUEsS0FBQSxPQUFBLG9CQUFBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsQ0FBQSxhQUFBLENBQUEsS0FBQSxPQUFBLG9CQUFBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsQ0FBQSxhQUFBLEtBQUEsT0FBQSxvQkFBQSxDQUFBLEtBQUEsT0FBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLENBQUE7Y0FDQSxLQUFBLE9BQUE7Y0FDQSxDQUFBLEtBQUEsT0FBQTtjQUNBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUE7Y0FDQSxLQUFBLE9BQUE7Y0FDQSxDQUFBLEtBQUEsT0FBQTtjQUNBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsS0FBQSxPQUFBLFlBQUEsS0FBQSxPQUFBLGFBQUEsQ0FBQSxLQUFBLE9BQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxLQUFBLE9BQUE7O1FBRUEsT0FBQTs7O01BR0EsT0FBQSxlQUFBLENBQUEsYUFBQSxLQUFBLE9BQUEsb0JBQUEsQ0FBQSxLQUFBLE9BQUE7O01BRUEsT0FBQSxjQUFBLFVBQUE7UUFDQTtXQUNBO1dBQ0EsS0FBQSxVQUFBO1lBQ0EsV0FBQTs7Ozs7Ozs7TUFRQSxJQUFBLFlBQUEsSUFBQSxTQUFBO01BQ0EsT0FBQSxpQkFBQSxLQUFBLFlBQUEsVUFBQSxTQUFBLFNBQUE7TUFDQSxPQUFBLG1CQUFBLEtBQUEsWUFBQSxVQUFBLFNBQUEsU0FBQTtNQUNBLE9BQUEsZUFBQSxLQUFBLFlBQUEsVUFBQSxTQUFBLFNBQUE7OztNQUdBLE9BQUEsbUJBQUEsVUFBQTs7UUFFQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7VUFDQSxNQUFBO1VBQ0Esa0JBQUE7VUFDQSxvQkFBQTtVQUNBLG1CQUFBO1VBQ0EsZ0JBQUE7YUFDQSxVQUFBOztZQUVBO2VBQ0EsaUJBQUEsS0FBQTtlQUNBLFFBQUEsU0FBQSxLQUFBO2dCQUNBLFdBQUEsY0FBQTtnQkFDQSxPQUFBLE9BQUE7Ozs7Ozs7QUNyR0EsUUFBQSxPQUFBO0dBQ0EsV0FBQSxZQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLGFBQUEsVUFBQSxPQUFBLGFBQUEsS0FBQTs7TUFFQSxJQUFBLFdBQUEsU0FBQTs7TUFFQSxPQUFBLFlBQUEsTUFBQSxVQUFBOztNQUVBLE9BQUEsT0FBQSxZQUFBOztNQUVBLE9BQUEsT0FBQTs7TUFFQSxTQUFBLHFCQUFBO1FBQ0E7V0FDQTtXQUNBLFFBQUEsU0FBQSxLQUFBO1lBQ0EsT0FBQSxRQUFBO1lBQ0EsT0FBQSxZQUFBLEtBQUE7Ozs7TUFJQSxJQUFBLE9BQUEsS0FBQSxTQUFBO1FBQ0E7OztNQUdBLE9BQUEsV0FBQSxVQUFBO1FBQ0EsR0FBQSxPQUFBLFFBQUEsT0FBQSxRQUFBLEdBQUE7VUFDQTthQUNBLGlCQUFBLE9BQUE7YUFDQSxRQUFBLFNBQUEsS0FBQTtjQUNBLE9BQUEsUUFBQTtjQUNBLE9BQUEsT0FBQTtjQUNBOzthQUVBLE1BQUEsU0FBQSxJQUFBO2NBQ0EsT0FBQSxRQUFBLElBQUE7O2VBRUE7VUFDQSxPQUFBLFFBQUE7Ozs7TUFJQSxPQUFBLFlBQUEsVUFBQTtRQUNBO1dBQ0E7V0FDQSxRQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsUUFBQTtZQUNBLE9BQUEsT0FBQTtZQUNBLE9BQUEsWUFBQTs7V0FFQSxNQUFBLFNBQUEsSUFBQTtZQUNBLE9BQUEsUUFBQSxJQUFBLEtBQUE7Ozs7O0FBS0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdyZWcnLCBbXHJcbiAgJ3VpLnJvdXRlcicsXHJcbl0pO1xyXG5cclxuYXBwXHJcbiAgLmNvbmZpZyhbXHJcbiAgICAnJGh0dHBQcm92aWRlcicsXHJcbiAgICBmdW5jdGlvbigkaHR0cFByb3ZpZGVyKXtcclxuXHJcbiAgICAgIC8vIEFkZCBhdXRoIHRva2VuIHRvIEF1dGhvcml6YXRpb24gaGVhZGVyXHJcbiAgICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ0F1dGhJbnRlcmNlcHRvcicpO1xyXG5cclxuICAgIH1dKVxyXG4gIC5ydW4oW1xyXG4gICAgJ0F1dGhTZXJ2aWNlJyxcclxuICAgICdTZXNzaW9uJyxcclxuICAgIGZ1bmN0aW9uKEF1dGhTZXJ2aWNlLCBTZXNzaW9uKXtcclxuXHJcbiAgICAgIC8vIFN0YXJ0dXAsIGxvZ2luIGlmIHRoZXJlJ3MgIGEgdG9rZW4uXHJcbiAgICAgIHZhciB0b2tlbiA9IFNlc3Npb24uZ2V0VG9rZW4oKTtcclxuICAgICAgaWYgKHRva2VuKXtcclxuICAgICAgICBBdXRoU2VydmljZS5sb2dpbldpdGhUb2tlbih0b2tlbik7XHJcbiAgICAgIH1cclxuXHJcbiAgfV0pO1xyXG5cclxuIiwiY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpXHJcbmFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gICAgLmNvbnN0YW50KCdFVkVOVF9JTkZPJywge1xyXG4gICAgICAgIE5BTUU6ICdIYWNrTVRZICcrIHRvZGF5LmdldEZ1bGxZZWFyKCksXHJcbiAgICB9KVxyXG4gICAgLmNvbnN0YW50KCdEQVNIQk9BUkQnLCB7XHJcbiAgICAgICAgVU5WRVJJRklFRDogJ1lvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhbiBlbWFpbCBhc2tpbmcgeW91IHZlcmlmeSB5b3VyIGVtYWlsLiBDbGljayB0aGUgbGluayBpbiB0aGUgZW1haWwgYW5kIHlvdSBjYW4gc3RhcnQgeW91ciBhcHBsaWNhdGlvbiEnLFxyXG4gICAgICAgIElOQ09NUExFVEVfVElUTEU6ICdZb3Ugc3RpbGwgbmVlZCB0byBjb21wbGV0ZSB5b3VyIGFwcGxpY2F0aW9uIScsXHJcbiAgICAgICAgSU5DT01QTEVURTogJ0lmIHlvdSBkbyBub3QgY29tcGxldGUgeW91ciBhcHBsaWNhdGlvbiBiZWZvcmUgdGhlIFtBUFBfREVBRExJTkVdLCB5b3Ugd2lsbCBub3QgYmUgY29uc2lkZXJlZCBmb3IgdGhlIGFkbWlzc2lvbnMgbG90dGVyeSEnLFxyXG4gICAgICAgIFNVQk1JVFRFRF9USVRMRTogJ1lvdXIgYXBwbGljYXRpb24gaGFzIGJlZW4gc3VibWl0dGVkIScsXHJcbiAgICAgICAgU1VCTUlUVEVEOiAnRmVlbCBmcmVlIHRvIGVkaXQgaXQgYXQgYW55IHRpbWUuIEhvd2V2ZXIsIG9uY2UgcmVnaXN0cmF0aW9uIGlzIGNsb3NlZCwgeW91IHdpbGwgbm90IGJlIGFibGUgdG8gZWRpdCBpdCBhbnkgZnVydGhlci5cXG5BZG1pc3Npb25zIHdpbGwgYmUgZGV0ZXJtaW5lZCBieSBhIHJhbmRvbSBsb3R0ZXJ5LiBQbGVhc2UgbWFrZSBzdXJlIHlvdXIgaW5mb3JtYXRpb24gaXMgYWNjdXJhdGUgYmVmb3JlIHJlZ2lzdHJhdGlvbiBpcyBjbG9zZWQhJyxcclxuICAgICAgICBDTE9TRURfQU5EX0lOQ09NUExFVEVfVElUTEU6ICdVbmZvcnR1bmF0ZWx5LCByZWdpc3RyYXRpb24gaGFzIGNsb3NlZCwgYW5kIHRoZSBsb3R0ZXJ5IHByb2Nlc3MgaGFzIGJlZ3VuLicsXHJcbiAgICAgICAgQ0xPU0VEX0FORF9JTkNPTVBMRVRFOiAnQmVjYXVzZSB5b3UgaGF2ZSBub3QgY29tcGxldGVkIHlvdXIgcHJvZmlsZSBpbiB0aW1lLCB5b3Ugd2lsbCBub3QgYmUgZWxpZ2libGUgZm9yIHRoZSBsb3R0ZXJ5IHByb2Nlc3MuJyxcclxuICAgICAgICBBRE1JVFRFRF9BTkRfQ0FOX0NPTkZJUk1fVElUTEU6ICdZb3UgbXVzdCBjb25maXJtIGJ5IFtDT05GSVJNX0RFQURMSU5FXS4nLFxyXG4gICAgICAgIEFETUlUVEVEX0FORF9DQU5OT1RfQ09ORklSTV9USVRMRTogJ1lvdXIgY29uZmlybWF0aW9uIGRlYWRsaW5lIG9mIFtDT05GSVJNX0RFQURMSU5FXSBoYXMgcGFzc2VkLicsXHJcbiAgICAgICAgQURNSVRURURfQU5EX0NBTk5PVF9DT05GSVJNOiAnQWx0aG91Z2ggeW91IHdlcmUgYWNjZXB0ZWQsIHlvdSBkaWQgbm90IGNvbXBsZXRlIHlvdXIgY29uZmlybWF0aW9uIGluIHRpbWUuXFxuVW5mb3J0dW5hdGVseSwgdGhpcyBtZWFucyB0aGF0IHlvdSB3aWxsIG5vdCBiZSBhYmxlIHRvIGF0dGVuZCB0aGUgZXZlbnQsIGFzIHdlIG11c3QgYmVnaW4gdG8gYWNjZXB0IG90aGVyIGFwcGxpY2FudHMgb24gdGhlIHdhaXRsaXN0LlxcbldlIGhvcGUgdG8gc2VlIHlvdSBhZ2FpbiBuZXh0IHllYXIhJyxcclxuICAgICAgICBDT05GSVJNRURfTk9UX1BBU1RfVElUTEU6ICdZb3UgY2FuIGVkaXQgeW91ciBjb25maXJtYXRpb24gaW5mb3JtYXRpb24gdW50aWwgW0NPTkZJUk1fREVBRExJTkVdJyxcclxuICAgICAgICBERUNMSU5FRDogJ1dlXFwncmUgc29ycnkgdG8gaGVhciB0aGF0IHlvdSB3b25cXCd0IGJlIGFibGUgdG8gbWFrZSBpdCB0byBIYWNrTUlUIDIwMTghIDooXFxuTWF5YmUgbmV4dCB5ZWFyISBXZSBob3BlIHlvdSBzZWUgeW91IGFnYWluIHNvb24uJyxcclxuICAgIH0pXHJcbiAgICAuY29uc3RhbnQoJ1RFQU0nLHtcclxuICAgICAgICBOT19URUFNX1JFR19DTE9TRUQ6ICdVbmZvcnR1bmF0ZWx5LCBpdFxcJ3MgdG9vIGxhdGUgdG8gZW50ZXIgdGhlIGxvdHRlcnkgd2l0aCBhIHRlYW0uXFxuSG93ZXZlciwgeW91IGNhbiBzdGlsbCBmb3JtIHRlYW1zIG9uIHlvdXIgb3duIGJlZm9yZSBvciBkdXJpbmcgdGhlIGV2ZW50IScsXHJcbiAgICB9KVxyXG4gICAgLmNvbnN0YW50KCdBUElfS0VZJywgJ2RpMFRiX3Rjc2U4QUFBQUFBQUF5cmVqVnhoZVc3aXBZa3FKbzVMQlFlai02VmsyTzhVWU81SFRoREkyS1p0YUEnKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLmNvbmZpZyhbXHJcbiAgICAnJHN0YXRlUHJvdmlkZXInLFxyXG4gICAgJyR1cmxSb3V0ZXJQcm92aWRlcicsXHJcbiAgICAnJGxvY2F0aW9uUHJvdmlkZXInLFxyXG4gICAgZnVuY3Rpb24oXHJcbiAgICAgICRzdGF0ZVByb3ZpZGVyLFxyXG4gICAgICAkdXJsUm91dGVyUHJvdmlkZXIsXHJcbiAgICAgICRsb2NhdGlvblByb3ZpZGVyKSB7XHJcblxyXG4gICAgLy8gRm9yIGFueSB1bm1hdGNoZWQgdXJsLCByZWRpcmVjdCB0byAvc3RhdGUxXHJcbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKFwiLzQwNFwiKTtcclxuXHJcbiAgICAvLyBTZXQgdXAgZGUgc3RhdGVzXHJcbiAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAuc3RhdGUoJ2xvZ2luJywge1xyXG4gICAgICAgIHVybDogXCIvbG9naW5cIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9sb2dpbi9sb2dpbi5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ0xvZ2luQ3RybCcsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgcmVxdWlyZUxvZ2luOiBmYWxzZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgJ3NldHRpbmdzJzogZnVuY3Rpb24oU2V0dGluZ3NTZXJ2aWNlKXtcclxuICAgICAgICAgICAgcmV0dXJuIFNldHRpbmdzU2VydmljZS5nZXRQdWJsaWNTZXR0aW5ncygpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCdhcHAnLCB7XHJcbiAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICcnOiB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2Jhc2UuaHRtbFwiXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgJ3NpZGViYXJAYXBwJzoge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9zaWRlYmFyL3NpZGViYXIuaHRtbFwiLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnU2lkZWJhckN0cmwnLFxyXG4gICAgICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgICAgJ3NldHRpbmdzJyA6IGZ1bmN0aW9uKFNldHRpbmdzU2VydmljZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFNldHRpbmdzU2VydmljZS5nZXRQdWJsaWNTZXR0aW5ncygpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHJlcXVpcmVMb2dpbjogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCdhcHAuZGFzaGJvYXJkJywge1xyXG4gICAgICAgIHVybDogXCIvXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvZGFzaGJvYXJkL2Rhc2hib2FyZC5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ0Rhc2hib2FyZEN0cmwnLFxyXG4gICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgIGN1cnJlbnRVc2VyOiBmdW5jdGlvbihVc2VyU2VydmljZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBVc2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNldHRpbmdzOiBmdW5jdGlvbihTZXR0aW5nc1NlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCdhcHAuYXBwbGljYXRpb24nLCB7XHJcbiAgICAgICAgdXJsOiBcIi9hcHBsaWNhdGlvblwiLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnQXBwbGljYXRpb25DdHJsJyxcclxuICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICBjdXJyZW50VXNlcjogZnVuY3Rpb24oVXNlclNlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gVXNlclNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzZXR0aW5nczogZnVuY3Rpb24oU2V0dGluZ3NTZXJ2aWNlKXtcclxuICAgICAgICAgICAgcmV0dXJuIFNldHRpbmdzU2VydmljZS5nZXRQdWJsaWNTZXR0aW5ncygpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCdhcHAuY29uZmlybWF0aW9uJywge1xyXG4gICAgICAgIHVybDogXCIvY29uZmlybWF0aW9uXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvY29uZmlybWF0aW9uL2NvbmZpcm1hdGlvbi5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ0NvbmZpcm1hdGlvbkN0cmwnLFxyXG4gICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgIGN1cnJlbnRVc2VyOiBmdW5jdGlvbihVc2VyU2VydmljZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBVc2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNldHRpbmdzOiBmdW5jdGlvbihTZXR0aW5nc1NlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuc3RhdGUoJ2FwcC50ZWFtJywge1xyXG4gICAgICAgIHVybDogXCIvdGVhbVwiLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3RlYW0vdGVhbS5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ1RlYW1DdHJsJyxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICByZXF1aXJlVmVyaWZpZWQ6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgIGN1cnJlbnRVc2VyOiBmdW5jdGlvbihVc2VyU2VydmljZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBVc2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNldHRpbmdzOiBmdW5jdGlvbihTZXR0aW5nc1NlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuc3RhdGUoJ2FwcC53b3Jrc2hvcHMnLCB7XHJcbiAgICAgICAgdXJsOiBcIi93b3Jrc2hvcHNcIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy93b3Jrc2hvcHMvd29ya3Nob3BzLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnd29ya3Nob3BzQ3RybCcsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgcmVxdWlyZVZlcmlmaWVkOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICBjdXJyZW50VXNlcjogZnVuY3Rpb24oVXNlclNlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gVXNlclNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzZXR0aW5nczogZnVuY3Rpb24oU2V0dGluZ3NTZXJ2aWNlKXtcclxuICAgICAgICAgICAgcmV0dXJuIFNldHRpbmdzU2VydmljZS5nZXRQdWJsaWNTZXR0aW5ncygpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCdhcHAuY2hhbGxlbmdlcycsIHtcclxuICAgICAgICB1cmw6IFwiL2NoYWxsZW5nZXNcIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jaGFsbGVuZ2VzL2NoYWxsZW5nZXMuaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdjaGFsbGVuZ2VzQ3RybCcsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgcmVxdWlyZVZlcmlmaWVkOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICBjdXJyZW50VXNlcjogZnVuY3Rpb24oVXNlclNlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gVXNlclNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzZXR0aW5nczogZnVuY3Rpb24oU2V0dGluZ3NTZXJ2aWNlKXtcclxuICAgICAgICAgICAgcmV0dXJuIFNldHRpbmdzU2VydmljZS5nZXRQdWJsaWNTZXR0aW5ncygpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCdhcHAuYWRtaW4nLCB7XHJcbiAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICcnOiB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluL2FkbWluLmh0bWxcIixcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkbWluQ3RybCdcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHJlcXVpcmVBZG1pbjogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCdhcHAuYWRtaW4uc3RhdHMnLCB7XHJcbiAgICAgICAgdXJsOiBcIi9hZG1pblwiLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluL3N0YXRzL3N0YXRzLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5TdGF0c0N0cmwnXHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmFkbWluLnVzZXJzJywge1xyXG4gICAgICAgIHVybDogXCIvYWRtaW4vdXNlcnM/XCIgK1xyXG4gICAgICAgICAgJyZwYWdlJyArXHJcbiAgICAgICAgICAnJnNpemUnICtcclxuICAgICAgICAgICcmcXVlcnknLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluL3VzZXJzL3VzZXJzLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5Vc2Vyc0N0cmwnXHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmFkbWluLnVzZXInLCB7XHJcbiAgICAgICAgdXJsOiBcIi9hZG1pbi91c2Vycy86aWRcIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi91c2VyL3VzZXIuaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdBZG1pblVzZXJDdHJsJyxcclxuICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAndXNlcic6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcywgVXNlclNlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gVXNlclNlcnZpY2UuZ2V0KCRzdGF0ZVBhcmFtcy5pZCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuc3RhdGUoJ2FwcC5hZG1pbi5zZXR0aW5ncycsIHtcclxuICAgICAgICB1cmw6IFwiL2FkbWluL3NldHRpbmdzXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4vc2V0dGluZ3Mvc2V0dGluZ3MuaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdBZG1pblNldHRpbmdzQ3RybCcsXHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgncmVzZXQnLCB7XHJcbiAgICAgICAgdXJsOiBcIi9yZXNldC86dG9rZW5cIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9yZXNldC9yZXNldC5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ1Jlc2V0Q3RybCcsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgcmVxdWlyZUxvZ2luOiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCd2ZXJpZnknLCB7XHJcbiAgICAgICAgdXJsOiBcIi92ZXJpZnkvOnRva2VuXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvdmVyaWZ5L3ZlcmlmeS5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ1ZlcmlmeUN0cmwnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHJlcXVpcmVMb2dpbjogZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnNDA0Jywge1xyXG4gICAgICAgIHVybDogXCIvNDA0XCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvNDA0Lmh0bWxcIixcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICByZXF1aXJlTG9naW46IGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUoe1xyXG4gICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgfSk7XHJcblxyXG4gIH1dKVxyXG4gIC5ydW4oW1xyXG4gICAgJyRyb290U2NvcGUnLFxyXG4gICAgJyRzdGF0ZScsXHJcbiAgICAnU2Vzc2lvbicsXHJcbiAgICBmdW5jdGlvbihcclxuICAgICAgJHJvb3RTY29wZSxcclxuICAgICAgJHN0YXRlLFxyXG4gICAgICBTZXNzaW9uICl7XHJcblxyXG4gICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgPSAwO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMpIHtcclxuICAgICAgICB2YXIgcmVxdWlyZUxvZ2luID0gdG9TdGF0ZS5kYXRhLnJlcXVpcmVMb2dpbjtcclxuICAgICAgICB2YXIgcmVxdWlyZUFkbWluID0gdG9TdGF0ZS5kYXRhLnJlcXVpcmVBZG1pbjtcclxuICAgICAgICB2YXIgcmVxdWlyZVZlcmlmaWVkID0gdG9TdGF0ZS5kYXRhLnJlcXVpcmVWZXJpZmllZDtcclxuXHJcbiAgICAgICAgaWYgKHJlcXVpcmVMb2dpbiAmJiAhU2Vzc2lvbi5nZXRUb2tlbigpKSB7XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHJlcXVpcmVBZG1pbiAmJiAhU2Vzc2lvbi5nZXRVc2VyKCkuYWRtaW4pIHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChyZXF1aXJlVmVyaWZpZWQgJiYgIVNlc3Npb24uZ2V0VXNlcigpLnZlcmlmaWVkKXtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9KTtcclxuXHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5mYWN0b3J5KCdBdXRoSW50ZXJjZXB0b3InLCBbXHJcbiAgICAnU2Vzc2lvbicsXHJcbiAgICBmdW5jdGlvbihTZXNzaW9uKXtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHJlcXVlc3Q6IGZ1bmN0aW9uKGNvbmZpZyl7XHJcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IFNlc3Npb24uZ2V0VG9rZW4oKTtcclxuICAgICAgICAgICAgaWYgKHRva2VuICYmIGNvbmZpZy51cmwuc2VhcmNoKFwiZHJvcGJveFwiKSA9PSAtMSl7XHJcbiAgICAgICAgICAgICAgY29uZmlnLmhlYWRlcnNbJ3gtYWNjZXNzLXRva2VuJ10gPSB0b2tlbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY29uZmlnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5zZXJ2aWNlKCdTZXNzaW9uJywgW1xyXG4gICAgJyRyb290U2NvcGUnLFxyXG4gICAgJyR3aW5kb3cnLFxyXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHdpbmRvdyl7XHJcblxyXG4gICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbih0b2tlbiwgdXNlcil7XHJcbiAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLmp3dCA9IHRva2VuO1xyXG4gICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS51c2VySWQgPSB1c2VyLl9pZDtcclxuICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2UuY3VycmVudFVzZXIgPSBKU09OLnN0cmluZ2lmeSh1c2VyKTtcclxuICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IHVzZXI7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uKG9uQ29tcGxldGUpe1xyXG4gICAgICBkZWxldGUgJHdpbmRvdy5sb2NhbFN0b3JhZ2Uuand0O1xyXG4gICAgICBkZWxldGUgJHdpbmRvdy5sb2NhbFN0b3JhZ2UudXNlcklkO1xyXG4gICAgICBkZWxldGUgJHdpbmRvdy5sb2NhbFN0b3JhZ2UuY3VycmVudFVzZXI7XHJcbiAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSBudWxsO1xyXG4gICAgICBpZiAob25Db21wbGV0ZSl7XHJcbiAgICAgICAgb25Db21wbGV0ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuZ2V0VG9rZW4gPSBmdW5jdGlvbigpe1xyXG4gICAgICByZXR1cm4gJHdpbmRvdy5sb2NhbFN0b3JhZ2Uuand0O1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmdldFVzZXJJZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHJldHVybiAkd2luZG93LmxvY2FsU3RvcmFnZS51c2VySWQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuZ2V0VXNlciA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKCR3aW5kb3cubG9jYWxTdG9yYWdlLmN1cnJlbnRVc2VyKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5zZXRVc2VyID0gZnVuY3Rpb24odXNlcil7XHJcbiAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLmN1cnJlbnRVc2VyID0gSlNPTi5zdHJpbmdpZnkodXNlcik7XHJcbiAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSB1c2VyO1xyXG4gICAgfTtcclxuXHJcbiAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5mYWN0b3J5KCdVdGlscycsIFtcclxuICAgIGZ1bmN0aW9uKCl7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgaXNSZWdPcGVuOiBmdW5jdGlvbihzZXR0aW5ncyl7XHJcbiAgICAgICAgICByZXR1cm4gRGF0ZS5ub3coKSA+IHNldHRpbmdzLnRpbWVPcGVuICYmIERhdGUubm93KCkgPCBzZXR0aW5ncy50aW1lQ2xvc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpc0FmdGVyOiBmdW5jdGlvbih0aW1lKXtcclxuICAgICAgICAgIHJldHVybiBEYXRlLm5vdygpID4gdGltZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZvcm1hdFRpbWU6IGZ1bmN0aW9uKHRpbWUpe1xyXG5cclxuICAgICAgICAgIGlmICghdGltZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBcIkludmFsaWQgRGF0ZVwiO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGRhdGUgPSBuZXcgRGF0ZSh0aW1lKTtcclxuICAgICAgICAgIHZhciB0aW1lWm9uZSA9IG1vbWVudC50ei5ndWVzcygpO1xyXG4gICAgICAgICAgdmFyIHRpbWVab25lT2Zmc2V0ID0gZGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpO1xyXG5cclxuICAgICAgICAgIC8vIEhhY2sgZm9yIHRpbWV6b25lXHJcbiAgICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUpLmZvcm1hdCgnZGRkZCwgTU1NTSBEbyBZWVlZLCBoOm1tIGEnKSArXHJcbiAgICAgICAgICAgIFwiIFwiICsgbW9tZW50LnR6LnpvbmUodGltZVpvbmUpLmFiYnIodGltZVpvbmVPZmZzZXQpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcbiAgICB9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLmZhY3RvcnkoJ0F1dGhTZXJ2aWNlJywgW1xyXG4gICAgJyRodHRwJyxcclxuICAgICckcm9vdFNjb3BlJyxcclxuICAgICckc3RhdGUnLFxyXG4gICAgJyR3aW5kb3cnLFxyXG4gICAgJ1Nlc3Npb24nLFxyXG4gICAgZnVuY3Rpb24oJGh0dHAsICRyb290U2NvcGUsICRzdGF0ZSwgJHdpbmRvdywgU2Vzc2lvbikge1xyXG4gICAgICB2YXIgYXV0aFNlcnZpY2UgPSB7fTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGxvZ2luU3VjY2VzcyhkYXRhLCBjYil7XHJcbiAgICAgICAgLy8gV2lubmVyIHdpbm5lciB5b3UgZ2V0IGEgdG9rZW5cclxuICAgICAgICBTZXNzaW9uLmNyZWF0ZShkYXRhLnRva2VuLCBkYXRhLnVzZXIpO1xyXG5cclxuICAgICAgICBpZiAoY2Ipe1xyXG4gICAgICAgICAgY2IoZGF0YS51c2VyKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGxvZ2luRmFpbHVyZShkYXRhLCBjYil7XHJcbiAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xyXG4gICAgICAgIGlmIChjYikge1xyXG4gICAgICAgICAgY2IoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBhdXRoU2VydmljZS5sb2dpbldpdGhQYXNzd29yZCA9IGZ1bmN0aW9uKGVtYWlsLCBwYXNzd29yZCwgb25TdWNjZXNzLCBvbkZhaWx1cmUpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHBcclxuICAgICAgICAgIC5wb3N0KCcvYXV0aC9sb2dpbicsIHtcclxuICAgICAgICAgICAgZW1haWw6IGVtYWlsLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgbG9naW5TdWNjZXNzKGRhdGEsIG9uU3VjY2Vzcyk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICBsb2dpbkZhaWx1cmUoZGF0YSwgb25GYWlsdXJlKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgYXV0aFNlcnZpY2UubG9naW5XaXRoVG9rZW4gPSBmdW5jdGlvbih0b2tlbiwgb25TdWNjZXNzLCBvbkZhaWx1cmUpe1xyXG4gICAgICAgIHJldHVybiAkaHR0cFxyXG4gICAgICAgICAgLnBvc3QoJy9hdXRoL2xvZ2luJywge1xyXG4gICAgICAgICAgICB0b2tlbjogdG9rZW5cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgbG9naW5TdWNjZXNzKGRhdGEsIG9uU3VjY2Vzcyk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1c0NvZGUpe1xyXG4gICAgICAgICAgICBpZiAoc3RhdHVzQ29kZSA9PT0gNDAwKXtcclxuICAgICAgICAgICAgICBTZXNzaW9uLmRlc3Ryb3kobG9naW5GYWlsdXJlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBhdXRoU2VydmljZS5sb2dvdXQgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gICAgICAgIC8vIENsZWFyIHRoZSBzZXNzaW9uXHJcbiAgICAgICAgU2Vzc2lvbi5kZXN0cm95KGNhbGxiYWNrKTtcclxuICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBhdXRoU2VydmljZS5yZWdpc3RlciA9IGZ1bmN0aW9uKGVtYWlsLCBwYXNzd29yZCwgb25TdWNjZXNzLCBvbkZhaWx1cmUpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHBcclxuICAgICAgICAgIC5wb3N0KCcvYXV0aC9yZWdpc3RlcicsIHtcclxuICAgICAgICAgICAgZW1haWw6IGVtYWlsLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgbG9naW5TdWNjZXNzKGRhdGEsIG9uU3VjY2Vzcyk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICBsb2dpbkZhaWx1cmUoZGF0YSwgb25GYWlsdXJlKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgYXV0aFNlcnZpY2UudmVyaWZ5ID0gZnVuY3Rpb24odG9rZW4sIG9uU3VjY2Vzcywgb25GYWlsdXJlKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwXHJcbiAgICAgICAgICAuZ2V0KCcvYXV0aC92ZXJpZnkvJyArIHRva2VuKVxyXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24odXNlcil7XHJcbiAgICAgICAgICAgIFNlc3Npb24uc2V0VXNlcih1c2VyKTtcclxuICAgICAgICAgICAgaWYgKG9uU3VjY2Vzcyl7XHJcbiAgICAgICAgICAgICAgb25TdWNjZXNzKHVzZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICBpZiAob25GYWlsdXJlKSB7XHJcbiAgICAgICAgICAgICAgb25GYWlsdXJlKGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGF1dGhTZXJ2aWNlLnJlc2VuZFZlcmlmaWNhdGlvbkVtYWlsID0gZnVuY3Rpb24ob25TdWNjZXNzLCBvbkZhaWx1cmUpe1xyXG4gICAgICAgIHJldHVybiAkaHR0cFxyXG4gICAgICAgICAgLnBvc3QoJy9hdXRoL3ZlcmlmeS9yZXNlbmQnLCB7XHJcbiAgICAgICAgICAgIGlkOiBTZXNzaW9uLmdldFVzZXJJZCgpXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGF1dGhTZXJ2aWNlLnNlbmRSZXNldEVtYWlsID0gZnVuY3Rpb24oZW1haWwpe1xyXG4gICAgICAgIHJldHVybiAkaHR0cFxyXG4gICAgICAgICAgLnBvc3QoJy9hdXRoL3Jlc2V0Jywge1xyXG4gICAgICAgICAgICBlbWFpbDogZW1haWxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgYXV0aFNlcnZpY2UucmVzZXRQYXNzd29yZCA9IGZ1bmN0aW9uKHRva2VuLCBwYXNzLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwXHJcbiAgICAgICAgICAucG9zdCgnL2F1dGgvcmVzZXQvcGFzc3dvcmQnLCB7XHJcbiAgICAgICAgICAgIHRva2VuOiB0b2tlbixcclxuICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3NcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuc3VjY2VzcyhvblN1Y2Nlc3MpXHJcbiAgICAgICAgICAuZXJyb3Iob25GYWlsdXJlKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJldHVybiBhdXRoU2VydmljZTtcclxuICAgIH1cclxuICBdKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuZmFjdG9yeSgnU2V0dGluZ3NTZXJ2aWNlJywgW1xyXG4gICckaHR0cCcsXHJcbiAgZnVuY3Rpb24oJGh0dHApe1xyXG5cclxuICAgIHZhciBiYXNlID0gJy9hcGkvc2V0dGluZ3MvJztcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBnZXRQdWJsaWNTZXR0aW5nczogZnVuY3Rpb24oKXtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UpO1xyXG4gICAgICB9LFxyXG4gICAgICB1cGRhdGVSZWdpc3RyYXRpb25UaW1lczogZnVuY3Rpb24ob3BlbiwgY2xvc2Upe1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoYmFzZSArICd0aW1lcycsIHtcclxuICAgICAgICAgIHRpbWVPcGVuOiBvcGVuLFxyXG4gICAgICAgICAgdGltZUNsb3NlOiBjbG9zZSxcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgdXBkYXRlQ29uZmlybWF0aW9uVGltZTogZnVuY3Rpb24odGltZSl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ2NvbmZpcm0tYnknLCB7XHJcbiAgICAgICAgICB0aW1lOiB0aW1lXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGdldFdoaXRlbGlzdGVkRW1haWxzOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSArICd3aGl0ZWxpc3QnKTtcclxuICAgICAgfSxcclxuICAgICAgdXBkYXRlV2hpdGVsaXN0ZWRFbWFpbHM6IGZ1bmN0aW9uKGVtYWlscyl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ3doaXRlbGlzdCcsIHtcclxuICAgICAgICAgIGVtYWlsczogZW1haWxzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIHVwZGF0ZVdhaXRsaXN0VGV4dDogZnVuY3Rpb24odGV4dCl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ3dhaXRsaXN0Jywge1xyXG4gICAgICAgICAgdGV4dDogdGV4dFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgICB1cGRhdGVBY2NlcHRhbmNlVGV4dDogZnVuY3Rpb24odGV4dCl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ2FjY2VwdGFuY2UnLCB7XHJcbiAgICAgICAgICB0ZXh0OiB0ZXh0XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIHVwZGF0ZUNvbmZpcm1hdGlvblRleHQ6IGZ1bmN0aW9uKHRleHQpe1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoYmFzZSArICdjb25maXJtYXRpb24nLCB7XHJcbiAgICAgICAgICB0ZXh0OiB0ZXh0XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIHVwZGF0ZUNoZWNrSW5PcGVuOiBmdW5jdGlvbihudW1iZXIpe1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoIGJhc2UgKyAnY2hlY2tJbk9wZW4nLCB7XHJcbiAgICAgICAgICBjaGVja0luT3BlbjogbnVtYmVyXHJcbiAgICAgICAgfSlcclxuICAgICAgfSxcclxuICAgICAgdXBkYXRlVGVhbVNpemVBY2NlcHRlZDogZnVuY3Rpb24gKG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoIGJhc2UgKyAndGVhbVNpemVBY2NlcHRlZCcsIHtcclxuICAgICAgICAgIHRlYW1TaXplQWNjZXB0ZWQ6IG51bWJlclxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0sXHJcbiAgICAgIHVwZGF0ZUhhY2tMb2NhdGlvbjogZnVuY3Rpb24gKGxhdGl0dWRlLCBsb25naXR1ZGUpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucHV0KCBiYXNlICsgJ2hhY2tMb2NhdGlvbicsIHtcclxuICAgICAgICAgIGxhdGl0dWRlOiBsYXRpdHVkZSxcclxuICAgICAgICAgIGxvbmdpdHVkZTogbG9uZ2l0dWRlXHJcbiAgICAgICAgfSlcclxuICAgICAgfSxcclxuICAgICAgdXBkYXRlTWF4VGFibGVDb3VudDogZnVuY3Rpb24gKG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoIGJhc2UgKyAnbWF4VGFibGVDb3VudCcsIHtcclxuICAgICAgICAgIG1heFRhYmxlQ291bnQ6IG51bWJlclxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gIH1cclxuICBdKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLmZhY3RvcnkoJ1VzZXJTZXJ2aWNlJywgW1xyXG4gICAgJyRodHRwJyxcclxuICAgICdTZXNzaW9uJyxcclxuICAgICdBUElfS0VZJyxcclxuICAgIGZ1bmN0aW9uKCRodHRwLCBTZXNzaW9uLCBBUElfS0VZKXtcclxuXHJcbiAgICAgIHZhciB1c2VycyA9ICcvYXBpL3VzZXJzJztcclxuICAgICAgdmFyIGJhc2UgPSB1c2VycyArICcvJztcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGh0dHBfaGVhZGVyX3NhZmVfanNvbih2KSB7XHJcblxyXG4gICAgICB2YXIgY2hhcnNUb0VuY29kZSA9IC9bXFx1MDA3Zi1cXHVmZmZmXS9nO1xyXG5cclxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodikucmVwbGFjZShjaGFyc1RvRW5jb2RlLFxyXG4gICAgICAgICAgZnVuY3Rpb24oYykge1xyXG4gICAgICAgICAgICByZXR1cm4gJ1xcXFx1JysoJzAwMCcrYy5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG5cclxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAvLyBCYXNpYyBBY3Rpb25zXHJcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgZ2V0Q3VycmVudFVzZXI6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgU2Vzc2lvbi5nZXRVc2VySWQoKSk7XHJcblxyXG4gICAgICB9LFxyXG4gICAgICBnZXQ6IGZ1bmN0aW9uKGlkKXtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBpZCk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZXRBbGw6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdldFBhZ2U6IGZ1bmN0aW9uKHBhZ2UsIHNpemUsIHRleHQpe1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQodXNlcnMgKyAnPycgKyAkLnBhcmFtKFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0ZXh0OiB0ZXh0LFxyXG4gICAgICAgICAgICBwYWdlOiBwYWdlID8gcGFnZSA6IDAsXHJcbiAgICAgICAgICAgIHNpemU6IHNpemUgPyBzaXplIDogNTBcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHVwZGF0ZVByb2ZpbGU6IGZ1bmN0aW9uKGlkLCBwcm9maWxlKXtcclxuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyBpZCArICcvcHJvZmlsZScsIHtcclxuICAgICAgICAgIHByb2ZpbGU6IHByb2ZpbGVcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHVwZGF0ZVJlc3VtZTogZnVuY3Rpb24oaWQsIGZpbGUpe1xyXG4gICAgICAgIHZhciBleHQgPSBmaWxlLm5hbWUuc3BsaXQoXCIuXCIpW2ZpbGUubmFtZS5zcGxpdChcIi5cIikubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgJGh0dHAoe1xyXG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICB1cmw6ICdodHRwczovL2NvbnRlbnQuZHJvcGJveGFwaS5jb20vMi9maWxlcy91cGxvYWQnLFxyXG4gICAgICAgICAgZGF0YTogZmlsZSxcclxuICAgICAgICAgIGhlYWRlcnMgOiB7XHJcbiAgICAgICAgICAgICdBdXRob3JpemF0aW9uJyA6ICdCZWFyZXIgJyArIEFQSV9LRVksXHJcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnIDogJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScsXHJcbiAgICAgICAgICAgICdEcm9wYm94LUFwaS1BcmcnIDogaHR0cF9oZWFkZXJfc2FmZV9qc29uKHtcclxuICAgICAgICAgICAgICAncGF0aCcgOiAnLycgKyBpZCArIFwiLlwiICsgZXh0LFxyXG4gICAgICAgICAgICAgICdtb2RlJyA6ICdvdmVyd3JpdGUnLFxyXG4gICAgICAgICAgICAgICdhdXRvcmVuYW1lJyA6IHRydWUsXHJcbiAgICAgICAgICAgICAgJ211dGUnIDogZmFsc2VcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdmaWxlIHVwbG9hZGVkIHN1Y2Nlc3NmdWxseScpO1xyXG4gICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3IgOiAnICsgZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB1cGRhdGVDb25maXJtYXRpb246IGZ1bmN0aW9uKGlkLCBjb25maXJtYXRpb24pe1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoYmFzZSArIGlkICsgJy9jb25maXJtJywge1xyXG4gICAgICAgICAgY29uZmlybWF0aW9uOiBjb25maXJtYXRpb25cclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGRlY2xpbmVBZG1pc3Npb246IGZ1bmN0aW9uKGlkKXtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyAnL2RlY2xpbmUnKTtcclxuICAgICAgfSxcclxuICAgICAgXHJcbiAgICAgIG1ha2VDaGVja0luOiBmdW5jdGlvbihsYXRpdHVkZSwgbG9uZ2l0dWRlKSB7XHJcbiAgICAgICAgY29vcmRpbmF0ZXMgPSB7XHJcbiAgICAgICAgICBsYXRpdHVkZTogbGF0aXR1ZGUsXHJcbiAgICAgICAgICBsb25naXR1ZGU6IGxvbmdpdHVkZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIFNlc3Npb24uZ2V0VXNlcklkKCkgKyAnL2NoZWNraW4vbG9jYXRpb24gJywgeyBjb29yZGluYXRlczpjb29yZGluYXRlcyB9ICk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgLy8gVGVhbVxyXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgam9pbk9yQ3JlYXRlVGVhbTogZnVuY3Rpb24oY29kZSl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgU2Vzc2lvbi5nZXRVc2VySWQoKSArICcvdGVhbScsIHtcclxuICAgICAgICAgIGNvZGU6IGNvZGVcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGxlYXZlVGVhbTogZnVuY3Rpb24oKXtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKGJhc2UgKyBTZXNzaW9uLmdldFVzZXJJZCgpICsgJy90ZWFtJyk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZXRNeVRlYW1tYXRlczogZnVuY3Rpb24oKXtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBTZXNzaW9uLmdldFVzZXJJZCgpICsgJy90ZWFtJyk7XHJcbiAgICAgIH0sXHJcbiAgICAgIFxyXG4gICAgICBhc3NpbmdUYWJsZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoIGJhc2UgKyBTZXNzaW9uLmdldFVzZXJJZCgpICsgJy9jb25maXJtZWQnKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgLy8gQWRtaW4gT25seVxyXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICBnZXRTdGF0czogZnVuY3Rpb24oKXtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyAnc3RhdHMnKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGFkbWl0VXNlcjogZnVuY3Rpb24oaWQpe1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArICcvYWRtaXQnKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGNoZWNrSW46IGZ1bmN0aW9uKGlkKXtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyAnL2NoZWNraW4nKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGNoZWNrT3V0OiBmdW5jdGlvbihpZCl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgJy9jaGVja291dCcpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgdXBkYXRlVGFibGU6IGZ1bmN0aW9uKHRlYW1Db2RlLCB0YWJsZU51bWJlcikge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoJy9hcGkvdGVhbXMvJyArIHRlYW1Db2RlICsgJy90YWJsZScsIHtcclxuICAgICAgICAgIHRhYmxlTnVtYmVyOiB0YWJsZU51bWJlclxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG4gIF0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuY29udHJvbGxlcignQWRtaW5TZXR0aW5nc0N0cmwnLCBbXHJcbiAgICAnJHNjb3BlJyxcclxuICAgICckc2NlJyxcclxuICAgICdTZXR0aW5nc1NlcnZpY2UnLFxyXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkc2NlLCBTZXR0aW5nc1NlcnZpY2Upe1xyXG5cclxuICAgICAgJHNjb3BlLnNldHRpbmdzID0ge307XHJcbiAgICAgIFNldHRpbmdzU2VydmljZVxyXG4gICAgICAgIC5nZXRQdWJsaWNTZXR0aW5ncygpXHJcbiAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oc2V0dGluZ3Mpe1xyXG4gICAgICAgICAgdXBkYXRlU2V0dGluZ3Moc2V0dGluZ3MpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgZnVuY3Rpb24gdXBkYXRlU2V0dGluZ3Moc2V0dGluZ3Mpe1xyXG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgc2V0dGluZ3MudGltZU9wZW4gPSBuZXcgRGF0ZShzZXR0aW5ncy50aW1lT3Blbik7XHJcbiAgICAgICAgc2V0dGluZ3MudGltZUNsb3NlID0gbmV3IERhdGUoc2V0dGluZ3MudGltZUNsb3NlKTtcclxuICAgICAgICBzZXR0aW5ncy50aW1lQ29uZmlybSA9IG5ldyBEYXRlKHNldHRpbmdzLnRpbWVDb25maXJtKTtcclxuICAgICAgICBzZXR0aW5ncy5jaGVja0luT3BlbiA9IG5ldyBEYXRlKHNldHRpbmdzLmNoZWNrSW5PcGVuKTtcclxuXHJcbiAgICAgICAgJHNjb3BlLnNldHRpbmdzID0gc2V0dGluZ3M7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFdoaXRlbGlzdCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgU2V0dGluZ3NTZXJ2aWNlXHJcbiAgICAgICAgLmdldFdoaXRlbGlzdGVkRW1haWxzKClcclxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihlbWFpbHMpe1xyXG4gICAgICAgICAgJHNjb3BlLndoaXRlbGlzdCA9IGVtYWlscy5qb2luKFwiLCBcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAkc2NvcGUudXBkYXRlV2hpdGVsaXN0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBTZXR0aW5nc1NlcnZpY2VcclxuICAgICAgICAgIC51cGRhdGVXaGl0ZWxpc3RlZEVtYWlscygkc2NvcGUud2hpdGVsaXN0LnJlcGxhY2UoLyAvZywgJycpLnNwbGl0KCcsJykpXHJcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihzZXR0aW5ncyl7XHJcbiAgICAgICAgICAgIHN3YWwoJ1doaXRlbGlzdCB1cGRhdGVkLicpO1xyXG4gICAgICAgICAgICAkc2NvcGUud2hpdGVsaXN0ID0gc2V0dGluZ3Mud2hpdGVsaXN0ZWRFbWFpbHMuam9pbihcIiwgXCIpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyBSZWdpc3RyYXRpb24gVGltZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICRzY29wZS5mb3JtYXREYXRlID0gZnVuY3Rpb24oZGF0ZSl7XHJcbiAgICAgICAgaWYgKCFkYXRlKXtcclxuICAgICAgICAgIHJldHVybiBcIkludmFsaWQgRGF0ZVwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHRpbWVab25lID0gbW9tZW50LnR6Lmd1ZXNzKCk7XHJcbiAgICAgICAgdmFyIHRpbWVab25lT2Zmc2V0ID0gZGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpO1xyXG5cclxuICAgICAgICAvLyBIYWNrIGZvciB0aW1lem9uZVxyXG4gICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSkuZm9ybWF0KCdkZGRkLCBNTU1NIERvIFlZWVksIGg6bW0gYScpICtcclxuICAgICAgICAgIFwiIFwiICsgbW9tZW50LnR6LnpvbmUodGltZVpvbmUpLmFiYnIodGltZVpvbmVPZmZzZXQpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gVGFrZSBhIGRhdGUgYW5kIHJlbW92ZSB0aGUgc2Vjb25kcy5cclxuICAgICAgZnVuY3Rpb24gY2xlYW5EYXRlKGRhdGUpe1xyXG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShcclxuICAgICAgICAgIGRhdGUuZ2V0RnVsbFllYXIoKSxcclxuICAgICAgICAgIGRhdGUuZ2V0TW9udGgoKSxcclxuICAgICAgICAgIGRhdGUuZ2V0RGF0ZSgpLFxyXG4gICAgICAgICAgZGF0ZS5nZXRIb3VycygpLFxyXG4gICAgICAgICAgZGF0ZS5nZXRNaW51dGVzKClcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkc2NvcGUudXBkYXRlUmVnaXN0cmF0aW9uVGltZXMgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIC8vIENsZWFuIHRoZSBkYXRlcyBhbmQgdHVybiB0aGVtIHRvIG1zLlxyXG4gICAgICAgIHZhciBvcGVuID0gY2xlYW5EYXRlKCRzY29wZS5zZXR0aW5ncy50aW1lT3BlbikuZ2V0VGltZSgpO1xyXG4gICAgICAgIHZhciBjbG9zZSA9IGNsZWFuRGF0ZSgkc2NvcGUuc2V0dGluZ3MudGltZUNsb3NlKS5nZXRUaW1lKCk7XHJcblxyXG4gICAgICAgIGlmIChvcGVuIDwgMCB8fCBjbG9zZSA8IDAgfHwgb3BlbiA9PT0gdW5kZWZpbmVkIHx8IGNsb3NlID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgcmV0dXJuIHN3YWwoJ09vcHMuLi4nLCAnWW91IG5lZWQgdG8gZW50ZXIgdmFsaWQgdGltZXMuJywgJ2Vycm9yJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvcGVuID49IGNsb3NlKXtcclxuICAgICAgICAgIHN3YWwoJ09vcHMuLi4nLCAnUmVnaXN0cmF0aW9uIGNhbm5vdCBvcGVuIGFmdGVyIGl0IGNsb3Nlcy4nLCAnZXJyb3InKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFNldHRpbmdzU2VydmljZVxyXG4gICAgICAgICAgLnVwZGF0ZVJlZ2lzdHJhdGlvblRpbWVzKG9wZW4sIGNsb3NlKVxyXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oc2V0dGluZ3Mpe1xyXG4gICAgICAgICAgICB1cGRhdGVTZXR0aW5ncyhzZXR0aW5ncyk7XHJcbiAgICAgICAgICAgIHN3YWwoXCJMb29rcyBnb29kIVwiLCBcIlJlZ2lzdHJhdGlvbiBUaW1lcyBVcGRhdGVkXCIsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gQ29uZmlybWF0aW9uIFRpbWUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICRzY29wZS51cGRhdGVDb25maXJtYXRpb25UaW1lID0gZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgY29uZmlybUJ5ID0gY2xlYW5EYXRlKCRzY29wZS5zZXR0aW5ncy50aW1lQ29uZmlybSkuZ2V0VGltZSgpO1xyXG5cclxuICAgICAgICBTZXR0aW5nc1NlcnZpY2VcclxuICAgICAgICAgIC51cGRhdGVDb25maXJtYXRpb25UaW1lKGNvbmZpcm1CeSlcclxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHNldHRpbmdzKXtcclxuICAgICAgICAgICAgdXBkYXRlU2V0dGluZ3Moc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICBzd2FsKFwiU291bmRzIGdvb2QhXCIsIFwiQ29uZmlybWF0aW9uIERhdGUgVXBkYXRlZFwiLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIEFjY2VwdGFuY2UgLyBDb25maXJtYXRpb24gVGV4dCAtLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICB2YXIgY29udmVydGVyID0gbmV3IHNob3dkb3duLkNvbnZlcnRlcigpO1xyXG5cclxuICAgICAgJHNjb3BlLm1hcmtkb3duUHJldmlldyA9IGZ1bmN0aW9uKHRleHQpe1xyXG4gICAgICAgIHJldHVybiAkc2NlLnRydXN0QXNIdG1sKGNvbnZlcnRlci5tYWtlSHRtbCh0ZXh0KSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUudXBkYXRlV2FpdGxpc3RUZXh0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgdGV4dCA9ICRzY29wZS5zZXR0aW5ncy53YWl0bGlzdFRleHQ7XHJcbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXHJcbiAgICAgICAgICAudXBkYXRlV2FpdGxpc3RUZXh0KHRleHQpXHJcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgc3dhbChcIkxvb2tzIGdvb2QhXCIsIFwiV2FpdGxpc3QgVGV4dCBVcGRhdGVkXCIsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgICAgICAgdXBkYXRlU2V0dGluZ3MoZGF0YSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS51cGRhdGVBY2NlcHRhbmNlVGV4dCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIHRleHQgPSAkc2NvcGUuc2V0dGluZ3MuYWNjZXB0YW5jZVRleHQ7XHJcbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXHJcbiAgICAgICAgICAudXBkYXRlQWNjZXB0YW5jZVRleHQodGV4dClcclxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICBzd2FsKFwiTG9va3MgZ29vZCFcIiwgXCJBY2NlcHRhbmNlIFRleHQgVXBkYXRlZFwiLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKGRhdGEpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUudXBkYXRlQ29uZmlybWF0aW9uVGV4dCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIHRleHQgPSAkc2NvcGUuc2V0dGluZ3MuY29uZmlybWF0aW9uVGV4dDtcclxuICAgICAgICBTZXR0aW5nc1NlcnZpY2VcclxuICAgICAgICAgIC51cGRhdGVDb25maXJtYXRpb25UZXh0KHRleHQpXHJcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgc3dhbChcIkxvb2tzIGdvb2QhXCIsIFwiQ29uZmlybWF0aW9uIFRleHQgVXBkYXRlZFwiLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKGRhdGEpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcbiAgICAgIFxyXG4gICAgICAvLyBDaGVja0luT3BlbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAkc2NvcGUudXBkYXRlQ2hlY2tJbk9wZW4gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHZhciBDaGVja0luT3BlbiA9IGNsZWFuRGF0ZSgkc2NvcGUuc2V0dGluZ3MuY2hlY2tJbk9wZW4pLmdldFRpbWUoKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgLnVwZGF0ZUNoZWNrSW5PcGVuKENoZWNrSW5PcGVuKVxyXG4gICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgICBzd2FsKFwiTG9va3MgZ29vZCFcIiwgXCJDaGVjayBJbiBPcGVuIFVwZGF0ZWRcIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgICAgICAgICB1cGRhdGVTZXR0aW5ncyhkYXRhKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFRlYW0gU2l6ZSB0byBiZSBhY2NlcHRlZCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAkc2NvcGUudXBkYXRlVGVhbVNpemVBY2NlcHRlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbnVtYmVyID0gJHNjb3BlLnNldHRpbmdzLnRlYW1TaXplQWNjZXB0ZWQ7XHJcbiAgICAgICAgICAgIFNldHRpbmdzU2VydmljZVxyXG4gICAgICAgICAgICAgICAgLnVwZGF0ZVRlYW1TaXplQWNjZXB0ZWQobnVtYmVyKVxyXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICAgICAgc3dhbChcIkxvb2tzIGdvb2QhXCIsIFwiVGVhbSBTaXplIHRvIGJlIEFjY2VwdGVkIFVwZGF0ZWRcIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBMb2NhdGlvbiBvZiB0aGUgaGFjayAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgJHNjb3BlLnVwZGF0ZUhhY2tMb2NhdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbGF0aXR1ZGUgPSAkc2NvcGUuc2V0dGluZ3MuaGFja0xvY2F0aW9uLmxhdGl0dWRlO1xyXG4gICAgICAgICAgICB2YXIgbG9uZ2l0dWRlID0gJHNjb3BlLnNldHRpbmdzLmhhY2tMb2NhdGlvbi5sb25naXR1ZGU7XHJcbiAgICAgICAgICAgIFNldHRpbmdzU2VydmljZVxyXG4gICAgICAgICAgICAgICAgLnVwZGF0ZUhhY2tMb2NhdGlvbihsYXRpdHVkZSwgbG9uZ2l0dWRlKVxyXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN3YWwoXCJMb29rcyBnb29kIVwiLCBcIkxvY2F0aW9uIG9mIHRoZSBIYWNrIGhhcyBiZWVuIFVwZGF0ZWRcIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gTWF4IHRhYmxlIGNvdW50IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICRzY29wZS51cGRhdGVNYXhUYWJsZUNvdW50ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBudW1iZXIgPSAkc2NvcGUuc2V0dGluZ3MubWF4VGFibGVDb3VudDtcclxuICAgICAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAudXBkYXRlTWF4VGFibGVDb3VudChudW1iZXIpXHJcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN3YWwoXCJMb29rcyBnb29kIVwiLCBcIk1heCBOdW1iZXIgb2YgVGFibGVzIFVwZGF0ZWRcIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuY29udHJvbGxlcignQWRtaW5Vc2VyQ3RybCcsW1xyXG4gICAgJyRzY29wZScsXHJcbiAgICAnJGh0dHAnLFxyXG4gICAgJ3VzZXInLFxyXG4gICAgJ1VzZXJTZXJ2aWNlJyxcclxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsIFVzZXIsIFVzZXJTZXJ2aWNlKXtcclxuICAgICAgJHNjb3BlLnNlbGVjdGVkVXNlciA9IFVzZXIuZGF0YTtcclxuXHJcbiAgICAgIC8vIFBvcHVsYXRlIHRoZSBzY2hvb2wgZHJvcGRvd25cclxuICAgICAgcG9wdWxhdGVTY2hvb2xzKCk7XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogVE9ETzogSkFOSyBXQVJOSU5HXHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiBwb3B1bGF0ZVNjaG9vbHMoKXtcclxuXHJcbiAgICAgICAgJGh0dHBcclxuICAgICAgICAgIC5nZXQoJy9hc3NldHMvc2Nob29scy5qc29uJylcclxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcyl7XHJcbiAgICAgICAgICAgIHZhciBzY2hvb2xzID0gcmVzLmRhdGE7XHJcbiAgICAgICAgICAgIHZhciBlbWFpbCA9ICRzY29wZS5zZWxlY3RlZFVzZXIuZW1haWwuc3BsaXQoJ0AnKVsxXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzY2hvb2xzW2VtYWlsXSl7XHJcbiAgICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkVXNlci5wcm9maWxlLnNjaG9vbCA9IHNjaG9vbHNbZW1haWxdLnNjaG9vbDtcclxuICAgICAgICAgICAgICAkc2NvcGUuYXV0b0ZpbGxlZFNjaG9vbCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgJHNjb3BlLmdyYWR1YXRpb25ZZWFycyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBncmFkdWF0aW9uWWVhcnMgPSBbXVxyXG4gICAgICAgIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKTtcclxuICAgICAgICBjb25zdCB0aGlzWWVhciA9IHRvZGF5LmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA2OyBpKyspIHtcclxuICAgICAgICAgIGdyYWR1YXRpb25ZZWFyc1tpXSA9IHRoaXNZZWFyK2k7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBncmFkdWF0aW9uWWVhcnM7XHJcbiAgICAgIH0oKTtcclxuXHJcblxyXG4gICAgICAkc2NvcGUudXBkYXRlUHJvZmlsZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAgIC51cGRhdGVQcm9maWxlKCRzY29wZS5zZWxlY3RlZFVzZXIuX2lkLCAkc2NvcGUuc2VsZWN0ZWRVc2VyLnByb2ZpbGUpXHJcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgJHNlbGVjdGVkVXNlciA9IGRhdGE7XHJcbiAgICAgICAgICAgIHN3YWwoXCJVcGRhdGVkIVwiLCBcIlByb2ZpbGUgdXBkYXRlZC5cIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5lcnJvcihmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBzd2FsKFwiT29wcywgeW91IGZvcmdvdCBzb21ldGhpbmcuXCIpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcbiAgICAgICRzY29wZS51cGRhdGVUYWJsZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIFVzZXJTZXJ2aWNlLnVwZGF0ZVRhYmxlKCRzY29wZS5zZWxlY3RlZFVzZXIudGVhbUNvZGUsICRzY29wZS5zZWxlY3RlZFVzZXIuc3RhdHVzLnRhYmxlTnVtYmVyKVxyXG4gICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgIHN3YWwoXCJVcGRhdGVkIVwiLCBcIlRhYmxlIG51bWJlciB1cGRhdGVkLlwiLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ2RhdGEgOj4+ICcsIGRhdGEpOyAgICAgICAgICBcclxuICAgICAgICAgIHN3YWwoXCJPb3BzIVwiLCBkYXRhLm1lc3NhZ2UsIFwiZXJyb3JcIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG5cclxuICAgIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuY29udHJvbGxlcignQWRtaW5TdGF0c0N0cmwnLFtcclxuICAgICckc2NvcGUnLFxyXG4gICAgJ1VzZXJTZXJ2aWNlJyxcclxuICAgIGZ1bmN0aW9uKCRzY29wZSwgVXNlclNlcnZpY2Upe1xyXG5cclxuICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAuZ2V0U3RhdHMoKVxyXG4gICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHN0YXRzKXtcclxuICAgICAgICAgICRzY29wZS5zdGF0cyA9IHN0YXRzO1xyXG5cclxuICAgICAgICAgIHZhciB0b2RheSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICB2YXIgeWVhciA9IHRvZGF5LmdldEZ1bGxZZWFyKCk7XHJcblxyXG4gICAgICAgICAgJHNjb3BlLnN0YXRzLnllYXJzID0gW107XHJcbiAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDw9IDU7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgdmFyIG9iaiA9IHtcclxuICAgICAgICAgICAgICBhbW91bnQ6ICRzY29wZS5zdGF0cy5kZW1vLnllYXJbeWVhciArIGluZGV4XSxcclxuICAgICAgICAgICAgICB5ZWFyOiB5ZWFyICsgaW5kZXgsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHNjb3BlLnN0YXRzLnllYXJzLnB1c2gob2JqKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAkc2NvcGUuZnJvbU5vdyA9IGZ1bmN0aW9uKGRhdGUpe1xyXG4gICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSkuZnJvbU5vdygpO1xyXG4gICAgICB9O1xyXG5cclxuICAgIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuY29udHJvbGxlcignQWRtaW5Vc2Vyc0N0cmwnLFtcclxuICAgICckc2NvcGUnLFxyXG4gICAgJyRzdGF0ZScsXHJcbiAgICAnJHN0YXRlUGFyYW1zJyxcclxuICAgICdVc2VyU2VydmljZScsXHJcbiAgICBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBVc2VyU2VydmljZSl7XHJcblxyXG4gICAgICAkc2NvcGUucGFnZXMgPSBbXTtcclxuICAgICAgJHNjb3BlLnVzZXJzID0gW107XHJcblxyXG4gICAgICAvLyBTZW1hbnRpYy1VSSBtb3ZlcyBtb2RhbCBjb250ZW50IGludG8gYSBkaW1tZXIgYXQgdGhlIHRvcCBsZXZlbC5cclxuICAgICAgLy8gV2hpbGUgdGhpcyBpcyB1c3VhbGx5IG5pY2UsIGl0IG1lYW5zIHRoYXQgd2l0aCBvdXIgcm91dGluZyB3aWxsIGdlbmVyYXRlXHJcbiAgICAgIC8vIG11bHRpcGxlIG1vZGFscyBpZiB5b3UgY2hhbmdlIHN0YXRlLiBLaWxsIHRoZSB0b3AgbGV2ZWwgZGltbWVyIG5vZGUgb24gaW5pdGlhbCBsb2FkXHJcbiAgICAgIC8vIHRvIHByZXZlbnQgdGhpcy5cclxuICAgICAgJCgnLnVpLmRpbW1lcicpLnJlbW92ZSgpO1xyXG4gICAgICAvLyBQb3B1bGF0ZSB0aGUgc2l6ZSBvZiB0aGUgbW9kYWwgZm9yIHdoZW4gaXQgYXBwZWFycywgd2l0aCBhbiBhcmJpdHJhcnkgdXNlci5cclxuICAgICAgJHNjb3BlLnNlbGVjdGVkVXNlciA9IHt9O1xyXG4gICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyLnNlY3Rpb25zID0gZ2VuZXJhdGVTZWN0aW9ucyh7c3RhdHVzOiAnJywgY29uZmlybWF0aW9uOiB7XHJcbiAgICAgICAgZGlldGFyeVJlc3RyaWN0aW9uczogW11cclxuICAgICAgfSwgcHJvZmlsZTogJyd9KTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZVBhZ2UoZGF0YSl7XHJcbiAgICAgICAgJHNjb3BlLnVzZXJzID0gZGF0YS51c2VycztcclxuICAgICAgICAkc2NvcGUuY3VycmVudFBhZ2UgPSBkYXRhLnBhZ2U7XHJcbiAgICAgICAgJHNjb3BlLnBhZ2VTaXplID0gZGF0YS5zaXplO1xyXG5cclxuICAgICAgICB2YXIgcCA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS50b3RhbFBhZ2VzOyBpKyspe1xyXG4gICAgICAgICAgcC5wdXNoKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkc2NvcGUucGFnZXMgPSBwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgIC5nZXRQYWdlKCRzdGF0ZVBhcmFtcy5wYWdlLCAkc3RhdGVQYXJhbXMuc2l6ZSwgJHN0YXRlUGFyYW1zLnF1ZXJ5KVxyXG4gICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgdXBkYXRlUGFnZShkYXRhKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICRzY29wZS4kd2F0Y2goJ3F1ZXJ5VGV4dCcsIGZ1bmN0aW9uKHF1ZXJ5VGV4dCl7XHJcbiAgICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAgIC5nZXRQYWdlKCRzdGF0ZVBhcmFtcy5wYWdlLCAkc3RhdGVQYXJhbXMuc2l6ZSwgcXVlcnlUZXh0KVxyXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgIHVwZGF0ZVBhZ2UoZGF0YSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAkc2NvcGUuZ29Ub1BhZ2UgPSBmdW5jdGlvbihwYWdlKXtcclxuICAgICAgICAkc3RhdGUuZ28oJ2FwcC5hZG1pbi51c2VycycsIHtcclxuICAgICAgICAgIHBhZ2U6IHBhZ2UsXHJcbiAgICAgICAgICBzaXplOiAkc3RhdGVQYXJhbXMuc2l6ZSB8fCA1MFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLmdvVXNlciA9IGZ1bmN0aW9uKCRldmVudCwgdXNlcil7XHJcbiAgICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgICAkc3RhdGUuZ28oJ2FwcC5hZG1pbi51c2VyJywge1xyXG4gICAgICAgICAgaWQ6IHVzZXIuX2lkXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUudG9nZ2xlQ2hlY2tJbiA9IGZ1bmN0aW9uKCRldmVudCwgdXNlciwgaW5kZXgpIHtcclxuICAgICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAgIGlmICghdXNlci5zdGF0dXMuY2hlY2tlZEluKXtcclxuICAgICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gY2hlY2sgaW4gXCIgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiIVwiLFxyXG4gICAgICAgICAgICB0eXBlOiBcIndhcm5pbmdcIixcclxuICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNERDZCNTVcIixcclxuICAgICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6IFwiWWVzLCBjaGVjayB0aGVtIGluLlwiLFxyXG4gICAgICAgICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2VcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgICAgICAgICAgLmNoZWNrSW4odXNlci5faWQpXHJcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbih1c2VyKXtcclxuICAgICAgICAgICAgICAgICAgJHNjb3BlLnVzZXJzW2luZGV4XSA9IHVzZXI7XHJcbiAgICAgICAgICAgICAgICAgIHN3YWwoXCJBY2NlcHRlZFwiLCB1c2VyLnByb2ZpbGUubmFtZSArICcgaGFzIGJlZW4gY2hlY2tlZCBpbi4nLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAgICAgLmNoZWNrT3V0KHVzZXIuX2lkKVxyXG4gICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbih1c2VyKXtcclxuICAgICAgICAgICAgICAkc2NvcGUudXNlcnNbaW5kZXhdID0gdXNlcjtcclxuICAgICAgICAgICAgICBzd2FsKFwiQWNjZXB0ZWRcIiwgdXNlci5wcm9maWxlLm5hbWUgKyAnIGhhcyBiZWVuIGNoZWNrZWQgb3V0LicsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLmFjY2VwdFVzZXIgPSBmdW5jdGlvbigkZXZlbnQsIHVzZXIsIGluZGV4KSB7XHJcbiAgICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gYWNjZXB0IFwiICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIiFcIixcclxuICAgICAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxyXG4gICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcclxuICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogXCIjREQ2QjU1XCIsXHJcbiAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogXCJZZXMsIGFjY2VwdCB0aGVtLlwiLFxyXG4gICAgICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlXHJcbiAgICAgICAgICB9LCBmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICAgICAgdGl0bGU6IFwiQXJlIHlvdSBzdXJlP1wiLFxyXG4gICAgICAgICAgICAgIHRleHQ6IFwiWW91ciBhY2NvdW50IHdpbGwgYmUgbG9nZ2VkIGFzIGhhdmluZyBhY2NlcHRlZCB0aGlzIHVzZXIuIFwiICtcclxuICAgICAgICAgICAgICAgIFwiUmVtZW1iZXIsIHRoaXMgcG93ZXIgaXMgYSBwcml2aWxlZ2UuXCIsXHJcbiAgICAgICAgICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI0RENkI1NVwiLFxyXG4gICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIlllcywgYWNjZXB0IHRoaXMgdXNlci5cIixcclxuICAgICAgICAgICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2VcclxuICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAgICAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAgIC5hZG1pdFVzZXIodXNlci5faWQpXHJcbiAgICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHVzZXIpe1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS51c2Vyc1tpbmRleF0gPSB1c2VyO1xyXG4gICAgICAgICAgICAgICAgICAgIHN3YWwoXCJBY2NlcHRlZFwiLCB1c2VyLnByb2ZpbGUubmFtZSArICcgaGFzIGJlZW4gYWRtaXR0ZWQuJywgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICB9O1xyXG5cclxuICAgICAgZnVuY3Rpb24gZm9ybWF0VGltZSh0aW1lKXtcclxuICAgICAgICBpZiAodGltZSkge1xyXG4gICAgICAgICAgcmV0dXJuIG1vbWVudCh0aW1lKS5mb3JtYXQoJ01NTU0gRG8gWVlZWSwgaDptbTpzcyBhJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAkc2NvcGUucm93Q2xhc3MgPSBmdW5jdGlvbih1c2VyKSB7XHJcbiAgICAgICAgaWYgKHVzZXIuYWRtaW4pe1xyXG4gICAgICAgICAgcmV0dXJuICdhZG1pbic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh1c2VyLnN0YXR1cy5jb25maXJtZWQpIHtcclxuICAgICAgICAgIHJldHVybiAncG9zaXRpdmUnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodXNlci5zdGF0dXMuYWRtaXR0ZWQgJiYgIXVzZXIuc3RhdHVzLmNvbmZpcm1lZCkge1xyXG4gICAgICAgICAgcmV0dXJuICd3YXJuaW5nJztcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBmdW5jdGlvbiBzZWxlY3RVc2VyKHVzZXIpe1xyXG4gICAgICAgICRzY29wZS5zZWxlY3RlZFVzZXIgPSB1c2VyO1xyXG4gICAgICAgICRzY29wZS5zZWxlY3RlZFVzZXIuc2VjdGlvbnMgPSBnZW5lcmF0ZVNlY3Rpb25zKHVzZXIpO1xyXG4gICAgICAgICQoJy5sb25nLnVzZXIubW9kYWwnKVxyXG4gICAgICAgICAgLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlU2VjdGlvbnModXNlcil7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ0Jhc2ljIEluZm8nLFxyXG4gICAgICAgICAgICBmaWVsZHM6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnQ3JlYXRlZCBPbicsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogZm9ybWF0VGltZSh1c2VyLnRpbWVzdGFtcClcclxuICAgICAgICAgICAgICB9LHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdMYXN0IFVwZGF0ZWQnLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZvcm1hdFRpbWUodXNlci5sYXN0VXBkYXRlZClcclxuICAgICAgICAgICAgICB9LHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdDb25maXJtIEJ5JyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBmb3JtYXRUaW1lKHVzZXIuc3RhdHVzLmNvbmZpcm1CeSkgfHwgJ04vQSdcclxuICAgICAgICAgICAgICB9LHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdDaGVja2VkIEluJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBmb3JtYXRUaW1lKHVzZXIuc3RhdHVzLmNoZWNrSW5UaW1lKSB8fCAnTi9BJ1xyXG4gICAgICAgICAgICAgIH0se1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ0VtYWlsJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmVtYWlsXHJcbiAgICAgICAgICAgICAgfSx7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnVGVhbScsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci50ZWFtQ29kZSB8fCAnTm9uZSdcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICAgIH0se1xyXG4gICAgICAgICAgICBuYW1lOiAnUHJvZmlsZScsXHJcbiAgICAgICAgICAgIGZpZWxkczogW1xyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdOYW1lJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUubmFtZVxyXG4gICAgICAgICAgICAgIH0se1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ0dlbmRlcicsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmdlbmRlclxyXG4gICAgICAgICAgICAgIH0se1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ1NjaG9vbCcsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLnNjaG9vbFxyXG4gICAgICAgICAgICAgIH0se1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ0dyYWR1YXRpb24gWWVhcicsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmdyYWR1YXRpb25ZZWFyXHJcbiAgICAgICAgICAgICAgfSx7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnRGVzY3JpcHRpb24nLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5kZXNjcmlwdGlvblxyXG4gICAgICAgICAgICAgIH0se1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ0Vzc2F5JyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZXNzYXlcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICAgIH0se1xyXG4gICAgICAgICAgICBuYW1lOiAnQ29uZmlybWF0aW9uJyxcclxuICAgICAgICAgICAgZmllbGRzOiBbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ1Bob25lIE51bWJlcicsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24ucGhvbmVOdW1iZXJcclxuICAgICAgICAgICAgICB9LHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdEaWV0YXJ5IFJlc3RyaWN0aW9ucycsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24uZGlldGFyeVJlc3RyaWN0aW9ucy5qb2luKCcsICcpXHJcbiAgICAgICAgICAgICAgfSx7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnU2hpcnQgU2l6ZScsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24uc2hpcnRTaXplXHJcbiAgICAgICAgICAgICAgfSx7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnTWFqb3InLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLm1ham9yXHJcbiAgICAgICAgICAgICAgfSx7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnR2l0aHViJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5naXRodWJcclxuICAgICAgICAgICAgICB9LHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdXZWJzaXRlJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi53ZWJzaXRlXHJcbiAgICAgICAgICAgICAgfSx7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnTmVlZHMgSGFyZHdhcmUnLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLm5lZWRzSGFyZHdhcmUsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcclxuICAgICAgICAgICAgICB9LHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdIYXJkd2FyZSBSZXF1ZXN0ZWQnLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLmhhcmR3YXJlXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgICB9LHtcclxuICAgICAgICAgICAgbmFtZTogJ0hvc3RpbmcnLFxyXG4gICAgICAgICAgICBmaWVsZHM6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnTmVlZHMgSG9zdGluZyBGcmlkYXknLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLmhvc3ROZWVkZWRGcmksXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcclxuICAgICAgICAgICAgICB9LHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdOZWVkcyBIb3N0aW5nIFNhdHVyZGF5JyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5ob3N0TmVlZGVkU2F0LFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXHJcbiAgICAgICAgICAgICAgfSx7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnR2VuZGVyIE5ldXRyYWwnLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLmdlbmRlck5ldXRyYWwsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcclxuICAgICAgICAgICAgICB9LHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdDYXQgRnJpZW5kbHknLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLmNhdEZyaWVuZGx5LFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXHJcbiAgICAgICAgICAgICAgfSx7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnU21va2luZyBGcmllbmRseScsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24uc21va2luZ0ZyaWVuZGx5LFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXHJcbiAgICAgICAgICAgICAgfSx7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnSG9zdGluZyBOb3RlcycsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24uaG9zdE5vdGVzXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgICB9LHtcclxuICAgICAgICAgICAgbmFtZTogJ1RyYXZlbCcsXHJcbiAgICAgICAgICAgIGZpZWxkczogW1xyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdOZWVkcyBSZWltYnVyc2VtZW50JyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5uZWVkc1JlaW1idXJzZW1lbnQsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcclxuICAgICAgICAgICAgICB9LHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdSZWNlaXZlZCBSZWltYnVyc2VtZW50JyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5uZWVkc1JlaW1idXJzZW1lbnQgJiYgdXNlci5zdGF0dXMucmVpbWJ1cnNlbWVudEdpdmVuXHJcbiAgICAgICAgICAgICAgfSx7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnQWRkcmVzcycsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24uYWRkcmVzcyA/IFtcclxuICAgICAgICAgICAgICAgICAgdXNlci5jb25maXJtYXRpb24uYWRkcmVzcy5saW5lMSxcclxuICAgICAgICAgICAgICAgICAgdXNlci5jb25maXJtYXRpb24uYWRkcmVzcy5saW5lMixcclxuICAgICAgICAgICAgICAgICAgdXNlci5jb25maXJtYXRpb24uYWRkcmVzcy5jaXR5LFxyXG4gICAgICAgICAgICAgICAgICAnLCcsXHJcbiAgICAgICAgICAgICAgICAgIHVzZXIuY29uZmlybWF0aW9uLmFkZHJlc3Muc3RhdGUsXHJcbiAgICAgICAgICAgICAgICAgIHVzZXIuY29uZmlybWF0aW9uLmFkZHJlc3MuemlwLFxyXG4gICAgICAgICAgICAgICAgICAnLCcsXHJcbiAgICAgICAgICAgICAgICAgIHVzZXIuY29uZmlybWF0aW9uLmFkZHJlc3MuY291bnRyeSxcclxuICAgICAgICAgICAgICAgIF0uam9pbignICcpIDogJydcclxuICAgICAgICAgICAgICB9LHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdBZGRpdGlvbmFsIE5vdGVzJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5ub3Rlc1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRzY29wZS5zZWxlY3RVc2VyID0gc2VsZWN0VXNlcjtcclxuXHJcbiAgICB9XSk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAgIC5jb250cm9sbGVyKCdBcHBsaWNhdGlvbkN0cmwnLCBbXHJcbiAgICAgICckc2NvcGUnLFxyXG4gICAgICAnJHJvb3RTY29wZScsXHJcbiAgICAgICckc3RhdGUnLFxyXG4gICAgICAnJGh0dHAnLFxyXG4gICAgICAnY3VycmVudFVzZXInLFxyXG4gICAgICAnc2V0dGluZ3MnLFxyXG4gICAgICAnU2Vzc2lvbicsXHJcbiAgICAgICdVc2VyU2VydmljZScsXHJcbiAgICAgIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCAkaHR0cCwgY3VycmVudFVzZXIsIFNldHRpbmdzLCBTZXNzaW9uLCBVc2VyU2VydmljZSl7XHJcblxyXG4gICAgICAgIC8vIFNldCB1cCB0aGUgdXNlclxyXG4gICAgICAgICRzY29wZS51c2VyID0gY3VycmVudFVzZXIuZGF0YTtcclxuICAgICAgICAvLyBJcyB0aGUgc3R1ZGVudCBmcm9tIE1JVD9cclxuICAgICAgICAkc2NvcGUuaXNNaXRTdHVkZW50ID0gJHNjb3BlLnVzZXIuZW1haWwuc3BsaXQoJ0AnKVsxXSA9PSAnbWl0LmVkdSc7XHJcblxyXG4gICAgICAgIC8vIElmIHNvLCBkZWZhdWx0IHRoZW0gdG8gYWR1bHQ6IHRydWVcclxuICAgICAgICBpZiAoJHNjb3BlLmlzTWl0U3R1ZGVudCl7XHJcbiAgICAgICAgICAkc2NvcGUudXNlci5wcm9maWxlLmFkdWx0ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIVtcIlRlY25vbMOzZ2ljbyBkZSBNb250ZXJyZXkgQ2FtcHVzIE1vbnRlcnJleVwiLCBcIlRlY25vbMOzZ2ljbyBkZSBNb250ZXJyZXkgQ2FtcHVzIEd1YWRhbGFqYXJhXCIsXCJUZWNub2zDs2dpY28gZGUgTW9udGVycmV5IENhbXB1cyBQdWVibGFcIixcIlRlY25vbMOzZ2ljbyBkZSBNb250ZXJyZXkgQ2FtcHVzIENpdWRhZCBkZSBNw6l4aWNvXCIsXCJUZWNub2zDs2dpY28gZGUgTW9udGVycmV5IENhbXB1cyBTYW50YSBGw6lcIixcIlRlY25vbMOzZ2ljbyBkZSBNb250ZXJyZXkgQ2FtcHVzIExhZ3VuYVwiLFwiVGVjbm9sw7NnaWNvIGRlIE1vbnRlcnJleSBDYW1wdXMgU2FuIEx1aXNcIixcIlVuaXZlcnNpZGFkIGRlIE1vbnRlcnJleVwiXS5pbmNsdWRlcygkc2NvcGUudXNlci5wcm9maWxlLnNjaG9vbCkpIHtcclxuICAgICAgICAgICRzY29wZS51c2VyLnByb2ZpbGUub3RoZXJTY2hvb2wgPSAkc2NvcGUudXNlci5wcm9maWxlLnNjaG9vbFxyXG4gICAgICAgICAgJHNjb3BlLnVzZXIucHJvZmlsZS5zY2hvb2wgPSBcIk90cm9cIlxyXG4gICAgICAgIH1cclxuICAgICAgICAkc2NvcGUuaXNPdGhlclNjaG9vbCA9ICRzY29wZS51c2VyLnByb2ZpbGUuc2Nob29sID09PSBcIk90cm9cIjtcclxuXHJcbiAgICAgICAgLy8gUG9wdWxhdGUgdGhlIHNjaG9vbCBkcm9wZG93blxyXG4gICAgICAgIHBvcHVsYXRlU2Nob29scygpO1xyXG4gICAgICAgIF9zZXR1cEZvcm0oKTtcclxuXHJcbiAgICAgICAgJHNjb3BlLnJlZ0lzQ2xvc2VkID0gRGF0ZS5ub3coKSA+IFNldHRpbmdzLmRhdGEudGltZUNsb3NlO1xyXG4gICAgICAgICRzY29wZS5jaGVja0luQWN0aXZlID0gU2V0dGluZ3MuZGF0YS5jaGVja0luQWN0aXZlO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRPRE86IEpBTksgV0FSTklOR1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHBvcHVsYXRlU2Nob29scygpe1xyXG5cclxuICAgICAgICAgICRodHRwXHJcbiAgICAgICAgICAgICAgLmdldCgnL2Fzc2V0cy9zY2hvb2xzLmpzb24nKVxyXG4gICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2Nob29scyA9IHJlcy5kYXRhO1xyXG4gICAgICAgICAgICAgICAgdmFyIGVtYWlsID0gJHNjb3BlLnVzZXIuZW1haWwuc3BsaXQoJ0AnKVsxXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc2Nob29sc1tlbWFpbF0pe1xyXG4gICAgICAgICAgICAgICAgICAkc2NvcGUudXNlci5wcm9maWxlLnNjaG9vbCA9IHNjaG9vbHNbZW1haWxdLnNjaG9vbDtcclxuICAgICAgICAgICAgICAgICAgJHNjb3BlLmF1dG9GaWxsZWRTY2hvb2wgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gX3VwZGF0ZVVzZXIoZSl7XHJcbiAgICAgICAgICB2YXIgZmlsZSA9IGFuZ3VsYXIuZWxlbWVudCgnI3Jlc3VtZS1maWxlJylbMF0uZmlsZXNbMF07XHJcblxyXG4gICAgICAgICAgaWYoZmlsZSAmJiBmaWxlLnNpemUgPiA1MDAwMDAwKSB7XHJcbiAgICAgICAgICAgIHN3ZWV0QWxlcnQoXCJZb3VyIGZpbGUgaXMgdG9vIGJpZyA6KFwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmKGZpbGUpe1xyXG4gICAgICAgICAgICBVc2VyU2VydmljZS51cGRhdGVSZXN1bWUoU2Vzc2lvbi5nZXRVc2VySWQoKSwgZmlsZSk7XHJcbiAgICAgICAgICAgICRzY29wZS51c2VyLnByb2ZpbGUuY3YgPSBmaWxlLm5hbWU7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS51c2VyLnByb2ZpbGUuY3YpO1xyXG4gICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICBpZigkc2NvcGUuaXNPdGhlclNjaG9vbCl7XHJcbiAgICAgICAgICAgICRzY29wZS51c2VyLnByb2ZpbGUuc2Nob29sID0gJHNjb3BlLnVzZXIucHJvZmlsZS5vdGhlclNjaG9vbFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAgICAgICAudXBkYXRlUHJvZmlsZShTZXNzaW9uLmdldFVzZXJJZCgpLCAkc2NvcGUudXNlci5wcm9maWxlKVxyXG4gICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgc3dlZXRBbGVydCh7XHJcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkF3ZXNvbWUhXCIsXHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6IFwiWW91ciBhcHBsaWNhdGlvbiBoYXMgYmVlbiBzYXZlZC5cIixcclxuICAgICAgICAgICAgICAgICAgdHlwZTogXCJzdWNjZXNzXCIsXHJcbiAgICAgICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogXCIjZTc2NDgyXCJcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZXJyKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnIgOj4+ICcsIGVycik7XHJcbiAgICAgICAgICAgICAgICBpZihlcnIuc2hvd2FibGUpIHtcclxuICAgICAgICAgICAgICAgICAgc3dlZXRBbGVydChcIlVoIG9oIVwiLCBlcnIubWVzc2FnZSwgXCJlcnJvclwiKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIHN3ZWV0QWxlcnQoXCJVaCBvaCFcIiwgXCJTb21ldGhpbmcgd2VudCB3cm9uZy5cIiwgXCJlcnJvclwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICRzY29wZS51c2VyLnByb2ZpbGUuc2Nob29sID0gXCJPdHJvXCJcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIF9zZXR1cEZvcm0oKXtcclxuICAgICAgICAgIC8vIFNlbWFudGljLVVJIGZvcm0gdmFsaWRhdGlvblxyXG4gICAgICAgICAgJCgnLnVpLmZvcm0nKS5mb3JtKHtcclxuICAgICAgICAgICAgZmllbGRzOiB7XHJcbiAgICAgICAgICAgICAgbmFtZToge1xyXG4gICAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ25hbWUnLFxyXG4gICAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIGVudGVyIHlvdXIgbmFtZS4nXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGRpc2NvcmRVc2VybmFtZToge1xyXG4gICAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ2Rpc2NvcmRVc2VybmFtZScsXHJcbiAgICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcclxuICAgICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgZW50ZXIgeW91ciBEaXNjb3JkIHVzZXJuYW1lLidcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgc2Nob29sOiB7XHJcbiAgICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnc2Nob29sJyxcclxuICAgICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxyXG4gICAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBlbnRlciB5b3VyIHNjaG9vbCBuYW1lLidcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgeWVhcjoge1xyXG4gICAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3llYXInLFxyXG4gICAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIHNlbGVjdCB5b3VyIGdyYWR1YXRpb24geWVhci4nXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGdlbmRlcjoge1xyXG4gICAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ2dlbmRlcicsXHJcbiAgICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcclxuICAgICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2Ugc2VsZWN0IGEgZ2VuZGVyLidcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgYWR1bHQ6IHtcclxuICAgICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdhZHVsdCcsXHJcbiAgICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NoZWNrZWQnLFxyXG4gICAgICAgICAgICAgICAgICAgIHByb21wdDogJ1lvdSBtdXN0IGJlIGFuIGFkdWx0LCBvciBhbiBNSVQgc3R1ZGVudC4nXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHNjb3BlLmdyYWR1YXRpb25ZZWFycyA9IFtdXHJcbiAgICAgICAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IHRoaXNZZWFyID0gdG9kYXkuZ2V0RnVsbFllYXIoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDY7IGkrKykge1xyXG4gICAgICAgICAgJHNjb3BlLmdyYWR1YXRpb25ZZWFyc1tpXSA9IHRoaXNZZWFyK2k7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUuY2hlY2tPdGhlclNjaG9vbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgJHNjb3BlLmlzT3RoZXJTY2hvb2wgPSAkc2NvcGUudXNlci5wcm9maWxlLnNjaG9vbCA9PT0gXCJPdHJvXCI7XHJcbiAgICAgICAgICBpZighJHNjb3BlLmlzT3RoZXJTY2hvb2wpIHtcclxuICAgICAgICAgICAgJHNjb3BlLnVzZXIucHJvZmlsZS5vdGhlclNjaG9vbCA9ICcnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHNjb3BlLnN1Ym1pdEZvcm0gPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgaWYgKChcIi51aS5mb3JtXCIpLmZvcm0oJ2lzIHZhbGlkJykpe1xyXG4gICAgICAgICAgICBfdXBkYXRlVXNlcigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICB9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLmNvbnRyb2xsZXIoJ0NoYWxsZW5nZXNDdHJsJywgW1xyXG4gICAgJyRyb290U2NvcGUnLFxyXG4gICAgJyRzY29wZScsXHJcbiAgICAnJHNjZScsXHJcbiAgICAnY3VycmVudFVzZXInLFxyXG4gICAgJ3NldHRpbmdzJyxcclxuICAgICdVdGlscycsXHJcbiAgICAnQXV0aFNlcnZpY2UnLFxyXG4gICAgJ1VzZXJTZXJ2aWNlJyxcclxuICAgICdFVkVOVF9JTkZPJyxcclxuICAgICdEQVNIQk9BUkQnLFxyXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHNjb3BlLCAkc2NlLCBjdXJyZW50VXNlciwgc2V0dGluZ3MsIFV0aWxzLCBBdXRoU2VydmljZSwgVXNlclNlcnZpY2UsIERBU0hCT0FSRCl7XHJcbiAgICAgIHZhciBTZXR0aW5ncyA9IHNldHRpbmdzLmRhdGE7XHJcbiAgICAgIHZhciB1c2VyID0gY3VycmVudFVzZXIuZGF0YTtcclxuICAgICAgJHNjb3BlLnVzZXIgPSB1c2VyO1xyXG5cclxuICAgICAgJHNjb3BlLkRBU0hCT0FSRCA9IERBU0hCT0FSRDtcclxuICAgICAgXHJcbiAgICAgIGZvciAodmFyIG1zZyBpbiAkc2NvcGUuREFTSEJPQVJEKSB7XHJcbiAgICAgICAgaWYgKCRzY29wZS5EQVNIQk9BUkRbbXNnXS5pbmNsdWRlcygnW0FQUF9ERUFETElORV0nKSkge1xyXG4gICAgICAgICAgJHNjb3BlLkRBU0hCT0FSRFttc2ddID0gJHNjb3BlLkRBU0hCT0FSRFttc2ddLnJlcGxhY2UoJ1tBUFBfREVBRExJTkVdJywgVXRpbHMuZm9ybWF0VGltZShTZXR0aW5ncy50aW1lQ2xvc2UpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCRzY29wZS5EQVNIQk9BUkRbbXNnXS5pbmNsdWRlcygnW0NPTkZJUk1fREVBRExJTkVdJykpIHtcclxuICAgICAgICAgICRzY29wZS5EQVNIQk9BUkRbbXNnXSA9ICRzY29wZS5EQVNIQk9BUkRbbXNnXS5yZXBsYWNlKCdbQ09ORklSTV9ERUFETElORV0nLCBVdGlscy5mb3JtYXRUaW1lKHVzZXIuc3RhdHVzLmNvbmZpcm1CeSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gSXMgcmVnaXN0cmF0aW9uIG9wZW4/XHJcbiAgICAgIHZhciByZWdJc09wZW4gPSAkc2NvcGUucmVnSXNPcGVuID0gVXRpbHMuaXNSZWdPcGVuKFNldHRpbmdzKTtcclxuXHJcbiAgICAgIC8vIElzIGl0IHBhc3QgdGhlIHVzZXIncyBjb25maXJtYXRpb24gdGltZT9cclxuICAgICAgdmFyIHBhc3RDb25maXJtYXRpb24gPSAkc2NvcGUucGFzdENvbmZpcm1hdGlvbiA9IFV0aWxzLmlzQWZ0ZXIodXNlci5zdGF0dXMuY29uZmlybUJ5KTtcclxuXHJcbiAgICAgICRzY29wZS5kYXNoU3RhdGUgPSBmdW5jdGlvbihzdGF0dXMpe1xyXG4gICAgICAgIHZhciB1c2VyID0gJHNjb3BlLnVzZXI7XHJcbiAgICAgICAgc3dpdGNoIChzdGF0dXMpIHtcclxuICAgICAgICAgIGNhc2UgJ3VudmVyaWZpZWQnOlxyXG4gICAgICAgICAgICByZXR1cm4gIXVzZXIudmVyaWZpZWQ7XHJcbiAgICAgICAgICBjYXNlICdvcGVuQW5kSW5jb21wbGV0ZSc6XHJcbiAgICAgICAgICAgIHJldHVybiByZWdJc09wZW4gJiYgdXNlci52ZXJpZmllZCAmJiAhdXNlci5zdGF0dXMuY29tcGxldGVkUHJvZmlsZTtcclxuICAgICAgICAgIGNhc2UgJ29wZW5BbmRTdWJtaXR0ZWQnOlxyXG4gICAgICAgICAgICByZXR1cm4gcmVnSXNPcGVuICYmIHVzZXIuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGUgJiYgIXVzZXIuc3RhdHVzLmFkbWl0dGVkO1xyXG4gICAgICAgICAgY2FzZSAnY2xvc2VkQW5kSW5jb21wbGV0ZSc6XHJcbiAgICAgICAgICAgIHJldHVybiAhcmVnSXNPcGVuICYmICF1c2VyLnN0YXR1cy5jb21wbGV0ZWRQcm9maWxlICYmICF1c2VyLnN0YXR1cy5hZG1pdHRlZDtcclxuICAgICAgICAgIGNhc2UgJ2Nsb3NlZEFuZFN1Ym1pdHRlZCc6IC8vIFdhaXRsaXN0ZWQgU3RhdGVcclxuICAgICAgICAgICAgcmV0dXJuICFyZWdJc09wZW4gJiYgdXNlci5zdGF0dXMuY29tcGxldGVkUHJvZmlsZSAmJiAhdXNlci5zdGF0dXMuYWRtaXR0ZWQ7XHJcbiAgICAgICAgICBjYXNlICdhZG1pdHRlZEFuZENhbkNvbmZpcm0nOlxyXG4gICAgICAgICAgICByZXR1cm4gIXBhc3RDb25maXJtYXRpb24gJiZcclxuICAgICAgICAgICAgICB1c2VyLnN0YXR1cy5hZG1pdHRlZCAmJlxyXG4gICAgICAgICAgICAgICF1c2VyLnN0YXR1cy5jb25maXJtZWQgJiZcclxuICAgICAgICAgICAgICAhdXNlci5zdGF0dXMuZGVjbGluZWQ7XHJcbiAgICAgICAgICBjYXNlICdhZG1pdHRlZEFuZENhbm5vdENvbmZpcm0nOlxyXG4gICAgICAgICAgICByZXR1cm4gcGFzdENvbmZpcm1hdGlvbiAmJlxyXG4gICAgICAgICAgICAgIHVzZXIuc3RhdHVzLmFkbWl0dGVkICYmXHJcbiAgICAgICAgICAgICAgIXVzZXIuc3RhdHVzLmNvbmZpcm1lZCAmJlxyXG4gICAgICAgICAgICAgICF1c2VyLnN0YXR1cy5kZWNsaW5lZDtcclxuICAgICAgICAgIGNhc2UgJ2NvbmZpcm1lZCc6XHJcbiAgICAgICAgICAgIHJldHVybiB1c2VyLnN0YXR1cy5hZG1pdHRlZCAmJiB1c2VyLnN0YXR1cy5jb25maXJtZWQgJiYgIXVzZXIuc3RhdHVzLmRlY2xpbmVkO1xyXG4gICAgICAgICAgY2FzZSAnZGVjbGluZWQnOlxyXG4gICAgICAgICAgICByZXR1cm4gdXNlci5zdGF0dXMuZGVjbGluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS5zaG93V2FpdGxpc3QgPSAhcmVnSXNPcGVuICYmIHVzZXIuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGUgJiYgIXVzZXIuc3RhdHVzLmFkbWl0dGVkO1xyXG5cclxuICAgICAgJHNjb3BlLnJlc2VuZEVtYWlsID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBBdXRoU2VydmljZVxyXG4gICAgICAgICAgLnJlc2VuZFZlcmlmaWNhdGlvbkVtYWlsKClcclxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHN3ZWV0QWxlcnQoJ1lvdXIgZW1haWwgaGFzIGJlZW4gc2VudC4nKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuXHJcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgIC8vIFRleHQhXHJcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgIHZhciBjb252ZXJ0ZXIgPSBuZXcgc2hvd2Rvd24uQ29udmVydGVyKCk7XHJcbiAgICAgICRzY29wZS5hY2NlcHRhbmNlVGV4dCA9ICRzY2UudHJ1c3RBc0h0bWwoY29udmVydGVyLm1ha2VIdG1sKFNldHRpbmdzLmFjY2VwdGFuY2VUZXh0KSk7XHJcbiAgICAgICRzY29wZS5jb25maXJtYXRpb25UZXh0ID0gJHNjZS50cnVzdEFzSHRtbChjb252ZXJ0ZXIubWFrZUh0bWwoU2V0dGluZ3MuY29uZmlybWF0aW9uVGV4dCkpO1xyXG4gICAgICAkc2NvcGUud2FpdGxpc3RUZXh0ID0gJHNjZS50cnVzdEFzSHRtbChjb252ZXJ0ZXIubWFrZUh0bWwoU2V0dGluZ3Mud2FpdGxpc3RUZXh0KSk7XHJcblxyXG5cclxuICAgICAgJHNjb3BlLmRlY2xpbmVBZG1pc3Npb24gPSBmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIHRpdGxlOiBcIldob2EhXCIsXHJcbiAgICAgICAgICB0ZXh0OiBcIkFyZSB5b3Ugc3VyZSB5b3Ugd291bGQgbGlrZSB0byBkZWNsaW5lIHlvdXIgYWRtaXNzaW9uPyBcXG5cXG4gWW91IGNhbid0IGdvIGJhY2shXCIsXHJcbiAgICAgICAgICB0eXBlOiBcIndhcm5pbmdcIixcclxuICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXHJcbiAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI0RENkI1NVwiLFxyXG4gICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6IFwiWWVzLCBJIGNhbid0IG1ha2UgaXQuXCIsXHJcbiAgICAgICAgICBjbG9zZU9uQ29uZmlybTogdHJ1ZVxyXG4gICAgICAgICAgfSwgZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgLmRlY2xpbmVBZG1pc3Npb24odXNlci5faWQpXHJcbiAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24odXNlcil7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gdXNlcjtcclxuICAgICAgICAgICAgICAgICRzY29wZS51c2VyID0gdXNlcjtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb250cm9sbGVyKCdDb25maXJtYXRpb25DdHJsJywgW1xyXG4gICAgJyRzY29wZScsXHJcbiAgICAnJHJvb3RTY29wZScsXHJcbiAgICAnJHN0YXRlJyxcclxuICAgICdjdXJyZW50VXNlcicsXHJcbiAgICAnVXRpbHMnLFxyXG4gICAgJ1VzZXJTZXJ2aWNlJyxcclxuICAgICdzZXR0aW5ncycsXHJcbiAgICBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgY3VycmVudFVzZXIsIFV0aWxzLCBVc2VyU2VydmljZSwgc2V0dGluZ3Mpe1xyXG5cclxuICAgICAgLy8gU2V0IHVwIHRoZSB1c2VyXHJcbiAgICAgIHZhciB1c2VyID0gY3VycmVudFVzZXIuZGF0YTtcclxuICAgICAgJHNjb3BlLnVzZXIgPSB1c2VyO1xyXG4gICAgICBcclxuICAgICAgLy8gU2V0IHVwIHNldHRpbmdzXHJcbiAgICAgIHZhciBTZXR0aW5ncyA9IHNldHRpbmdzLmRhdGE7XHJcbiAgICAgICRzY29wZS5jaGVja0luQWN0aXZlID0gU2V0dGluZ3MuY2hlY2tJbkFjdGl2ZTtcclxuXHJcbiAgICAgICRzY29wZS5wYXN0Q29uZmlybWF0aW9uID0gRGF0ZS5ub3coKSA+IHVzZXIuc3RhdHVzLmNvbmZpcm1CeTtcclxuXHJcbiAgICAgICRzY29wZS5mb3JtYXRUaW1lID0gVXRpbHMuZm9ybWF0VGltZTtcclxuXHJcbiAgICAgIF9zZXR1cEZvcm0oKTtcclxuXHJcbiAgICAgICRzY29wZS5maWxlTmFtZSA9IHVzZXIuX2lkICsgXCJfXCIgKyB1c2VyLnByb2ZpbGUubmFtZS5zcGxpdChcIiBcIikuam9pbihcIl9cIik7XHJcblxyXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgIC8vIEFsbCB0aGlzIGp1c3QgZm9yIGRpZXRhcnkgcmVzdHJpY3Rpb24gY2hlY2tib3hlcyBmbWxcclxuXHJcbiAgICAgIHZhciBkaWV0YXJ5UmVzdHJpY3Rpb25zID0ge1xyXG4gICAgICAgICdWZWdldGFyaWFuJzogZmFsc2UsXHJcbiAgICAgICAgJ1ZlZ2FuJzogZmFsc2UsXHJcbiAgICAgICAgJ0hhbGFsJzogZmFsc2UsXHJcbiAgICAgICAgJ0tvc2hlcic6IGZhbHNlLFxyXG4gICAgICAgICdOdXQgQWxsZXJneSc6IGZhbHNlXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBpZiAodXNlci5jb25maXJtYXRpb24uZGlldGFyeVJlc3RyaWN0aW9ucyl7XHJcbiAgICAgICAgdXNlci5jb25maXJtYXRpb24uZGlldGFyeVJlc3RyaWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHJlc3RyaWN0aW9uKXtcclxuICAgICAgICAgIGlmIChyZXN0cmljdGlvbiBpbiBkaWV0YXJ5UmVzdHJpY3Rpb25zKXtcclxuICAgICAgICAgICAgZGlldGFyeVJlc3RyaWN0aW9uc1tyZXN0cmljdGlvbl0gPSB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkc2NvcGUuZGlldGFyeVJlc3RyaWN0aW9ucyA9IGRpZXRhcnlSZXN0cmljdGlvbnM7XHJcblxyXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICBmdW5jdGlvbiBfdXBkYXRlVXNlcihlKXtcclxuICAgICAgICB2YXIgY29uZmlybWF0aW9uID0gJHNjb3BlLnVzZXIuY29uZmlybWF0aW9uO1xyXG4gICAgICAgIC8vIEdldCB0aGUgZGlldGFyeSByZXN0cmljdGlvbnMgYXMgYW4gYXJyYXlcclxuICAgICAgICB2YXIgZHJzID0gW107XHJcbiAgICAgICAgT2JqZWN0LmtleXMoJHNjb3BlLmRpZXRhcnlSZXN0cmljdGlvbnMpLmZvckVhY2goZnVuY3Rpb24oa2V5KXtcclxuICAgICAgICAgIGlmICgkc2NvcGUuZGlldGFyeVJlc3RyaWN0aW9uc1trZXldKXtcclxuICAgICAgICAgICAgZHJzLnB1c2goa2V5KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25maXJtYXRpb24uZGlldGFyeVJlc3RyaWN0aW9ucyA9IGRycztcclxuXHJcbiAgICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAgIC51cGRhdGVDb25maXJtYXRpb24odXNlci5faWQsIGNvbmZpcm1hdGlvbilcclxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICBzd2VldEFsZXJ0KHtcclxuICAgICAgICAgICAgICB0aXRsZTogXCJXb28hXCIsXHJcbiAgICAgICAgICAgICAgdGV4dDogXCJZb3UncmUgY29uZmlybWVkIVwiLFxyXG4gICAgICAgICAgICAgIHR5cGU6IFwic3VjY2Vzc1wiLFxyXG4gICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogXCIjZTc2NDgyXCJcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKHJlcyl7XHJcbiAgICAgICAgICAgIHN3ZWV0QWxlcnQoXCJVaCBvaCFcIiwgXCJTb21ldGhpbmcgd2VudCB3cm9uZy5cIiwgXCJlcnJvclwiKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBfc2V0dXBGb3JtKCl7XHJcbiAgICAgICAgLy8gU2VtYW50aWMtVUkgZm9ybSB2YWxpZGF0aW9uXHJcbiAgICAgICAgJCgnLnVpLmZvcm0nKS5mb3JtKHtcclxuICAgICAgICAgIGZpZWxkczoge1xyXG4gICAgICAgICAgICBzaGlydDoge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdzaGlydCcsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcclxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIGdpdmUgdXMgYSBzaGlydCBzaXplISdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBob25lOiB7XHJcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3Bob25lJyxcclxuICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgZW50ZXIgYSBwaG9uZSBudW1iZXIuJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2lnbmF0dXJlUHJpdmFjeToge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdzaWduYXR1cmVQcml2YWN5UG9saWN5JyxcclxuICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgdHlwZSB5b3VyIGRpZ2l0YWwgc2lnbmF0dXJlLidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNpZ25hdHVyZUxpYWJpbGl0eToge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdzaWduYXR1cmVMaWFiaWxpdHlXYWl2ZXInLFxyXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXHJcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSB0eXBlIHlvdXIgZGlnaXRhbCBzaWduYXR1cmUuJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2lnbmF0dXJlUGhvdG9SZWxlYXNlOiB7XHJcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3NpZ25hdHVyZVBob3RvUmVsZWFzZScsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcclxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIHR5cGUgeW91ciBkaWdpdGFsIHNpZ25hdHVyZS4nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzaWduYXR1cmVDb2RlT2ZDb25kdWN0OiB7XHJcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3NpZ25hdHVyZUNvZGVPZkNvbmR1Y3QnLFxyXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXHJcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSB0eXBlIHlvdXIgZGlnaXRhbCBzaWduYXR1cmUuJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2lnbmF0dXJlTUxIOiB7XHJcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3NpZ25hdHVyZU1MSCcsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcclxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIHR5cGUgeW91ciBkaWdpdGFsIHNpZ25hdHVyZS4nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkc2NvcGUuc3VibWl0Rm9ybSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaWYgKCQoJy51aS5mb3JtJykuZm9ybSgnaXMgdmFsaWQnKSl7XHJcbiAgICAgICAgICBfdXBkYXRlVXNlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb250cm9sbGVyKCdBZG1pbkN0cmwnLCBbXHJcbiAgICAnJHNjb3BlJyxcclxuICAgICdVc2VyU2VydmljZScsXHJcbiAgICBmdW5jdGlvbigkc2NvcGUsIFVzZXJTZXJ2aWNlKXtcclxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xyXG4gICAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb250cm9sbGVyKCdEYXNoYm9hcmRDdHJsJywgW1xyXG4gICAgJyRyb290U2NvcGUnLFxyXG4gICAgJyRzY29wZScsXHJcbiAgICAnJHNjZScsXHJcbiAgICAnY3VycmVudFVzZXInLFxyXG4gICAgJ3NldHRpbmdzJyxcclxuICAgICdVdGlscycsXHJcbiAgICAnQXV0aFNlcnZpY2UnLFxyXG4gICAgJ1VzZXJTZXJ2aWNlJyxcclxuICAgICdFVkVOVF9JTkZPJyxcclxuICAgICdEQVNIQk9BUkQnLFxyXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHNjb3BlLCAkc2NlLCBjdXJyZW50VXNlciwgc2V0dGluZ3MsIFV0aWxzLCBBdXRoU2VydmljZSwgVXNlclNlcnZpY2UsRVZFTlRfSU5GTywgREFTSEJPQVJEKXtcclxuICAgICAgdmFyIFNldHRpbmdzID0gc2V0dGluZ3MuZGF0YTtcclxuICAgICAgdmFyIHVzZXIgPSBjdXJyZW50VXNlci5kYXRhO1xyXG4gICAgICAkc2NvcGUudXNlciA9IHVzZXI7XHJcbiAgICAgICRzY29wZS5zZXR0aW5ncyA9IFNldHRpbmdzO1xyXG4gICAgICAkc2NvcGUuREFTSEJPQVJEID0gREFTSEJPQVJEO1xyXG4gICAgICBcclxuICAgICAgLy8gU2hvdyBDaGVja0luT3BlbiBXaW5kb3cgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgIHZhciBzaG93Q2hlY2tJbk9wZW4gPSBmYWxzZTtcclxuICAgICAgdmFyIHRvZGF5RGF0ZSA9IG5ldyBEYXRlKCk7XHJcblxyXG4gICAgICBpZiAoIFNldHRpbmdzLmNoZWNrSW5BdmFpbGFibGUgJiYgdG9kYXlEYXRlLmdldFRpbWUoKSA+PSBTZXR0aW5ncy5jaGVja0luT3BlbiApIHtcclxuICAgICAgICBzaG93Q2hlY2tJbk9wZW4gPSB0cnVlO1xyXG4gICAgICAgIF9wb3B1bGF0ZVRlYW1tYXRlcygpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAkc2NvcGUuc2hvd0NoZWNrSW5PcGVuID0gc2hvd0NoZWNrSW5PcGVuO1xyXG4gICAgICBcclxuICAgICAgZm9yICh2YXIgbXNnIGluICRzY29wZS5EQVNIQk9BUkQpIHtcclxuICAgICAgICBpZiAoJHNjb3BlLkRBU0hCT0FSRFttc2ddLmluY2x1ZGVzKCdbQVBQX0RFQURMSU5FXScpKSB7XHJcbiAgICAgICAgICAkc2NvcGUuREFTSEJPQVJEW21zZ10gPSAkc2NvcGUuREFTSEJPQVJEW21zZ10ucmVwbGFjZSgnW0FQUF9ERUFETElORV0nLCBVdGlscy5mb3JtYXRUaW1lKFNldHRpbmdzLnRpbWVDbG9zZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoJHNjb3BlLkRBU0hCT0FSRFttc2ddLmluY2x1ZGVzKCdbQ09ORklSTV9ERUFETElORV0nKSkge1xyXG4gICAgICAgICAgJHNjb3BlLkRBU0hCT0FSRFttc2ddID0gJHNjb3BlLkRBU0hCT0FSRFttc2ddLnJlcGxhY2UoJ1tDT05GSVJNX0RFQURMSU5FXScsIFV0aWxzLmZvcm1hdFRpbWUodXNlci5zdGF0dXMuY29uZmlybUJ5KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAvLyBJcyByZWdpc3RyYXRpb24gb3Blbj9cclxuICAgICAgdmFyIHJlZ0lzT3BlbiA9ICRzY29wZS5yZWdJc09wZW4gPSBVdGlscy5pc1JlZ09wZW4oU2V0dGluZ3MpO1xyXG5cclxuICAgICAgLy8gSXMgaXQgcGFzdCB0aGUgdXNlcidzIGNvbmZpcm1hdGlvbiB0aW1lP1xyXG4gICAgICB2YXIgcGFzdENvbmZpcm1hdGlvbiA9ICRzY29wZS5wYXN0Q29uZmlybWF0aW9uID0gVXRpbHMuaXNBZnRlcih1c2VyLnN0YXR1cy5jb25maXJtQnkpO1xyXG5cclxuICAgICAgJHNjb3BlLmRhc2hTdGF0ZSA9IGZ1bmN0aW9uKHN0YXR1cyl7XHJcbiAgICAgICAgICBcclxuICAgICAgICB2YXIgdXNlciA9ICRzY29wZS51c2VyO1xyXG4gICAgICAgIHN3aXRjaCAoc3RhdHVzKSB7XHJcbiAgICAgICAgICBjYXNlICd1bnZlcmlmaWVkJzpcclxuICAgICAgICAgICAgcmV0dXJuICF1c2VyLnZlcmlmaWVkO1xyXG4gICAgICAgICAgY2FzZSAnb3BlbkFuZEluY29tcGxldGUnOlxyXG4gICAgICAgICAgICByZXR1cm4gcmVnSXNPcGVuICYmIHVzZXIudmVyaWZpZWQgJiYgIXVzZXIuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGU7XHJcbiAgICAgICAgICBjYXNlICdvcGVuQW5kU3VibWl0dGVkJzpcclxuICAgICAgICAgICAgcmV0dXJuIHJlZ0lzT3BlbiAmJiB1c2VyLnN0YXR1cy5jb21wbGV0ZWRQcm9maWxlICYmICF1c2VyLnN0YXR1cy5hZG1pdHRlZDtcclxuICAgICAgICAgIGNhc2UgJ2Nsb3NlZEFuZEluY29tcGxldGUnOlxyXG4gICAgICAgICAgICByZXR1cm4gIXJlZ0lzT3BlbiAmJiAhdXNlci5zdGF0dXMuY29tcGxldGVkUHJvZmlsZSAmJiAhdXNlci5zdGF0dXMuYWRtaXR0ZWQ7XHJcbiAgICAgICAgICBjYXNlICdjbG9zZWRBbmRTdWJtaXR0ZWQnOiAvLyBXYWl0bGlzdGVkIFN0YXRlXHJcbiAgICAgICAgICAgIHJldHVybiAhcmVnSXNPcGVuICYmIHVzZXIuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGUgJiYgIXVzZXIuc3RhdHVzLmFkbWl0dGVkO1xyXG4gICAgICAgICAgY2FzZSAnYWRtaXR0ZWRBbmRDYW5Db25maXJtJzpcclxuICAgICAgICAgICAgcmV0dXJuICFwYXN0Q29uZmlybWF0aW9uICYmXHJcbiAgICAgICAgICAgICAgdXNlci5zdGF0dXMuYWRtaXR0ZWQgJiZcclxuICAgICAgICAgICAgICAhdXNlci5zdGF0dXMuY29uZmlybWVkICYmXHJcbiAgICAgICAgICAgICAgIXVzZXIuc3RhdHVzLmRlY2xpbmVkO1xyXG4gICAgICAgICAgY2FzZSAnYWRtaXR0ZWRBbmRDYW5ub3RDb25maXJtJzpcclxuICAgICAgICAgICAgcmV0dXJuIHBhc3RDb25maXJtYXRpb24gJiZcclxuICAgICAgICAgICAgICB1c2VyLnN0YXR1cy5hZG1pdHRlZCAmJlxyXG4gICAgICAgICAgICAgICF1c2VyLnN0YXR1cy5jb25maXJtZWQgJiZcclxuICAgICAgICAgICAgICAhdXNlci5zdGF0dXMuZGVjbGluZWQ7XHJcbiAgICAgICAgICBjYXNlICdhZG1pdHRlZCc6XHJcbiAgICAgICAgICAgIHJldHVybiB1c2VyLnN0YXR1cy5hZG1pdHRlZCAmJiAhdXNlci5zdGF0dXMuZGVjbGluZWQ7XHJcbiAgICAgICAgICBjYXNlICdjb25maXJtZWQnOlxyXG4gICAgICAgICAgICByZXR1cm4gdXNlci5zdGF0dXMuYWRtaXR0ZWQgJiYgdXNlci5zdGF0dXMuY29uZmlybWVkICYmICF1c2VyLnN0YXR1cy5kZWNsaW5lZDtcclxuICAgICAgICAgIGNhc2UgJ2RlY2xpbmVkJzpcclxuICAgICAgICAgICAgcmV0dXJuIHVzZXIuc3RhdHVzLmRlY2xpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUuc2hvd1dhaXRsaXN0ID0gIXJlZ0lzT3BlbiAmJiB1c2VyLnN0YXR1cy5jb21wbGV0ZWRQcm9maWxlICYmICF1c2VyLnN0YXR1cy5hZG1pdHRlZDtcclxuXHJcbiAgICAgICRzY29wZS5yZXNlbmRFbWFpbCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgQXV0aFNlcnZpY2VcclxuICAgICAgICAgIC5yZXNlbmRWZXJpZmljYXRpb25FbWFpbCgpXHJcbiAgICAgICAgICAudGhlbihmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBzd2VldEFsZXJ0KCdZb3VyIGVtYWlsIGhhcyBiZWVuIHNlbnQuJyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcblxyXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAvLyBUZXh0IVxyXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICB2YXIgY29udmVydGVyID0gbmV3IHNob3dkb3duLkNvbnZlcnRlcigpO1xyXG4gICAgICAkc2NvcGUuYWNjZXB0YW5jZVRleHQgPSAkc2NlLnRydXN0QXNIdG1sKGNvbnZlcnRlci5tYWtlSHRtbChTZXR0aW5ncy5hY2NlcHRhbmNlVGV4dCkpO1xyXG4gICAgICAkc2NvcGUuY29uZmlybWF0aW9uVGV4dCA9ICRzY2UudHJ1c3RBc0h0bWwoY29udmVydGVyLm1ha2VIdG1sKFNldHRpbmdzLmNvbmZpcm1hdGlvblRleHQpKTtcclxuICAgICAgJHNjb3BlLndhaXRsaXN0VGV4dCA9ICRzY2UudHJ1c3RBc0h0bWwoY29udmVydGVyLm1ha2VIdG1sKFNldHRpbmdzLndhaXRsaXN0VGV4dCkpO1xyXG5cclxuXHJcbiAgICAgICRzY29wZS5kZWNsaW5lQWRtaXNzaW9uID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICB0aXRsZTogXCJXaG9hIVwiLFxyXG4gICAgICAgICAgdGV4dDogXCJBcmUgeW91IHN1cmUgeW91IHdvdWxkIGxpa2UgdG8gZGVjbGluZSB5b3VyIGFkbWlzc2lvbj8gXFxuXFxuIFlvdSBjYW4ndCBnbyBiYWNrIVwiLFxyXG4gICAgICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxyXG4gICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNERDZCNTVcIixcclxuICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIlllcywgSSBjYW4ndCBtYWtlIGl0LlwiLFxyXG4gICAgICAgICAgY2xvc2VPbkNvbmZpcm06IHRydWVcclxuICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgICAgICAgIC5kZWNsaW5lQWRtaXNzaW9uKHVzZXIuX2lkKVxyXG4gICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHVzZXIpe1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IHVzZXI7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUudXNlciA9IHVzZXI7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG5cclxuICAgICAgLy8gQXNrIGZvciBsb2NhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAkc2NvcGUub25DaGVja0luID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHtcclxuICAgICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oXHJcbiAgICAgICAgICAgICAgZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvb3JkcyA9IGRhdGEuY29vcmRzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxhdGl0dWRlID0gY29vcmRzLmxhdGl0dWRlO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxvbmdpdHVkZSA9IGNvb3Jkcy5sb25naXR1ZGU7XHJcbiAgICAgICAgICAgICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgICAgICAgICAgICAgIC5tYWtlQ2hlY2tJbihsYXRpdHVkZSwgbG9uZ2l0dWRlKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uICh1c2VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3YWwoJ1lvdSBhcmUgY2hlY2tlZCBpbicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXNlciA9IHVzZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9wb3B1bGF0ZVRlYW1tYXRlcygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKHJlcyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXMubWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yIDonLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBlcnJvclxyXG4gICAgICAgICAgICAgIH0se1xyXG4gICAgICAgICAgICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbWF4aW11bUFnZTogMCxcclxuICAgICAgICAgICAgICAgIHRpbWVvdXQ6IDEwMDAwXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGFsZXJ0KCdHZW9sb2NhdGlvbiBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoaXMgYnJvd3Nlci4nKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyBBc2sgZm9yIHRlYW0gbWF0ZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgIGZ1bmN0aW9uIF9wb3B1bGF0ZVRlYW1tYXRlcygpIHtcclxuICAgICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgICAgICAuZ2V0TXlUZWFtbWF0ZXMoKVxyXG4gICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbih1c2Vycyl7XHJcbiAgICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcclxuICAgICAgICAgICAgICAkc2NvcGUudGVhbW1hdGVzID0gdXNlcnM7XHJcbiAgICAgICAgICAgICAgX2Fza0ZvclRhYmxlKHVzZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIC8vIEFzayBmb3IgdGFibGUgbnVtYmVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgZnVuY3Rpb24gX2Fza0ZvclRhYmxlKHVzZXJzKSB7XHJcbiAgICAgICAgLy9pZiB0aGUgdXNlcnMgaGF2ZW4ndCBiZWVuIGFzc2luZyBhIHRhYmxlXHJcbiAgICAgICAgaWYodXNlcnMuYXNzaWduICYmIHVzZXIuc3RhdHVzLnRhYmxlTnVtYmVyID09ICdOb3QgYXNzaWduZWQnKSB7XHJcblxyXG4gICAgICAgICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgICAgICAgICAgLmFzc2luZ1RhYmxlKClcclxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uICh1c2VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSB1c2VyO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuY29udHJvbGxlcignTG9naW5DdHJsJywgW1xyXG4gICAgJyRzY29wZScsXHJcbiAgICAnJGh0dHAnLFxyXG4gICAgJyRzdGF0ZScsXHJcbiAgICAnc2V0dGluZ3MnLFxyXG4gICAgJ1V0aWxzJyxcclxuICAgICdBdXRoU2VydmljZScsXHJcbiAgICBmdW5jdGlvbigkc2NvcGUsICRodHRwLCAkc3RhdGUsIHNldHRpbmdzLCBVdGlscywgQXV0aFNlcnZpY2Upe1xyXG5cclxuICAgICAgLy8gSXMgcmVnaXN0cmF0aW9uIG9wZW4/XHJcbiAgICAgIHZhciBTZXR0aW5ncyA9IHNldHRpbmdzLmRhdGE7XHJcbiAgICAgICRzY29wZS5yZWdJc09wZW4gPSBVdGlscy5pc1JlZ09wZW4oU2V0dGluZ3MpO1xyXG5cclxuICAgICAgLy8gU3RhcnQgc3RhdGUgZm9yIGxvZ2luXHJcbiAgICAgICRzY29wZS5sb2dpblN0YXRlID0gJ2xvZ2luJztcclxuXHJcbiAgICAgIGZ1bmN0aW9uIG9uU3VjY2VzcygpIHtcclxuICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gb25FcnJvcihkYXRhKXtcclxuICAgICAgICAkc2NvcGUuZXJyb3IgPSBkYXRhLm1lc3NhZ2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHJlc2V0RXJyb3IoKXtcclxuICAgICAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHJlc2V0RXJyb3IoKTtcclxuICAgICAgICBBdXRoU2VydmljZS5sb2dpbldpdGhQYXNzd29yZChcclxuICAgICAgICAgICRzY29wZS5lbWFpbCwgJHNjb3BlLnBhc3N3b3JkLCBvblN1Y2Nlc3MsIG9uRXJyb3IpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLnJlZ2lzdGVyID0gZnVuY3Rpb24oKXtcclxuICAgICAgICByZXNldEVycm9yKCk7XHJcbiAgICAgICAgQXV0aFNlcnZpY2UucmVnaXN0ZXIoXHJcbiAgICAgICAgICAkc2NvcGUuZW1haWwsICRzY29wZS5wYXNzd29yZCwgb25TdWNjZXNzLCBvbkVycm9yKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS5zZXRMb2dpblN0YXRlID0gZnVuY3Rpb24oc3RhdGUpIHtcclxuICAgICAgICAkc2NvcGUubG9naW5TdGF0ZSA9IHN0YXRlO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLnNlbmRSZXNldEVtYWlsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGVtYWlsID0gJHNjb3BlLmVtYWlsO1xyXG4gICAgICAgIEF1dGhTZXJ2aWNlLnNlbmRSZXNldEVtYWlsKGVtYWlsKTtcclxuICAgICAgICBzd2VldEFsZXJ0KHtcclxuICAgICAgICAgIHRpdGxlOiBcIkRvbid0IFN3ZWF0IVwiLFxyXG4gICAgICAgICAgdGV4dDogXCJBbiBlbWFpbCBzaG91bGQgYmUgc2VudCB0byB5b3Ugc2hvcnRseS5cIixcclxuICAgICAgICAgIHR5cGU6IFwic3VjY2Vzc1wiLFxyXG4gICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNlNzY0ODJcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgIH1cclxuICBdKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLmNvbnRyb2xsZXIoJ1NpZGViYXJDdHJsJywgW1xyXG4gICAgJyRyb290U2NvcGUnLFxyXG4gICAgJyRzY29wZScsXHJcbiAgICAnc2V0dGluZ3MnLFxyXG4gICAgJ1V0aWxzJyxcclxuICAgICdBdXRoU2VydmljZScsXHJcbiAgICAnU2Vzc2lvbicsXHJcbiAgICAnRVZFTlRfSU5GTycsXHJcbiAgICBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc2NvcGUsIFNldHRpbmdzLCBVdGlscywgQXV0aFNlcnZpY2UsIFNlc3Npb24sIEVWRU5UX0lORk8pe1xyXG5cclxuICAgICAgdmFyIHNldHRpbmdzID0gU2V0dGluZ3MuZGF0YTtcclxuICAgICAgdmFyIHVzZXIgPSAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyO1xyXG5cclxuICAgICAgJHNjb3BlLkVWRU5UX0lORk8gPSBFVkVOVF9JTkZPO1xyXG5cclxuICAgICAgJHNjb3BlLnBhc3RDb25maXJtYXRpb24gPSBVdGlscy5pc0FmdGVyKHVzZXIuc3RhdHVzLmNvbmZpcm1CeSk7XHJcblxyXG4gICAgICAkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBBdXRoU2VydmljZS5sb2dvdXQoKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS5zaG93U2lkZWJhciA9IGZhbHNlO1xyXG4gICAgICAkc2NvcGUudG9nZ2xlU2lkZWJhciA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgJHNjb3BlLnNob3dTaWRlYmFyID0gISRzY29wZS5zaG93U2lkZWJhcjtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIG9oIGdvZCBqUXVlcnkgaGFja1xyXG4gICAgICAkKCcuaXRlbScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgJHNjb3BlLnNob3dTaWRlYmFyID0gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLmNvbnRyb2xsZXIoJ1Jlc2V0Q3RybCcsIFtcclxuICAgICckc2NvcGUnLFxyXG4gICAgJyRzdGF0ZVBhcmFtcycsXHJcbiAgICAnJHN0YXRlJyxcclxuICAgICdBdXRoU2VydmljZScsXHJcbiAgICBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZVBhcmFtcywgJHN0YXRlLCBBdXRoU2VydmljZSl7XHJcbiAgICAgIHZhciB0b2tlbiA9ICRzdGF0ZVBhcmFtcy50b2tlbjtcclxuXHJcbiAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICRzY29wZS5jaGFuZ2VQYXNzd29yZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIHBhc3N3b3JkID0gJHNjb3BlLnBhc3N3b3JkO1xyXG4gICAgICAgIHZhciBjb25maXJtID0gJHNjb3BlLmNvbmZpcm07XHJcblxyXG4gICAgICAgIGlmIChwYXNzd29yZCAhPT0gY29uZmlybSl7XHJcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBcIlBhc3N3b3JkcyBkb24ndCBtYXRjaCFcIjtcclxuICAgICAgICAgICRzY29wZS5jb25maXJtID0gXCJcIjtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEF1dGhTZXJ2aWNlLnJlc2V0UGFzc3dvcmQoXHJcbiAgICAgICAgICB0b2tlbixcclxuICAgICAgICAgICRzY29wZS5wYXNzd29yZCxcclxuICAgICAgICAgIGZ1bmN0aW9uKG1lc3NhZ2Upe1xyXG4gICAgICAgICAgICBzd2VldEFsZXJ0KHtcclxuICAgICAgICAgICAgICB0aXRsZTogXCJOZWF0byFcIixcclxuICAgICAgICAgICAgICB0ZXh0OiBcIllvdXIgcGFzc3dvcmQgaGFzIGJlZW4gY2hhbmdlZCFcIixcclxuICAgICAgICAgICAgICB0eXBlOiBcInN1Y2Nlc3NcIixcclxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI2U3NjQ4MlwiXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gZGF0YS5tZXNzYWdlO1xyXG4gICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb250cm9sbGVyKCdWZXJpZnlDdHJsJywgW1xyXG4gICAgJyRzY29wZScsXHJcbiAgICAnJHN0YXRlUGFyYW1zJyxcclxuICAgICdBdXRoU2VydmljZScsXHJcbiAgICBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZVBhcmFtcywgQXV0aFNlcnZpY2Upe1xyXG4gICAgICB2YXIgdG9rZW4gPSAkc3RhdGVQYXJhbXMudG9rZW47XHJcblxyXG4gICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgICBpZiAodG9rZW4pe1xyXG4gICAgICAgIEF1dGhTZXJ2aWNlLnZlcmlmeSh0b2tlbixcclxuICAgICAgICAgIGZ1bmN0aW9uKHVzZXIpe1xyXG4gICAgICAgICAgICAkc2NvcGUuc3VjY2VzcyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGZ1bmN0aW9uKGVycil7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLmNvbnRyb2xsZXIoJ1dvcmtzaG9wc0N0cmwnLCBbXHJcbiAgICAnJHJvb3RTY29wZScsXHJcbiAgICAnJHNjb3BlJyxcclxuICAgICckc2NlJyxcclxuICAgICdjdXJyZW50VXNlcicsXHJcbiAgICAnc2V0dGluZ3MnLFxyXG4gICAgJ1V0aWxzJyxcclxuICAgICdBdXRoU2VydmljZScsXHJcbiAgICAnVXNlclNlcnZpY2UnLFxyXG4gICAgJ0VWRU5UX0lORk8nLFxyXG4gICAgJ0RBU0hCT0FSRCcsXHJcbiAgICBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc2NvcGUsICRzY2UsIGN1cnJlbnRVc2VyLCBzZXR0aW5ncywgVXRpbHMsIEF1dGhTZXJ2aWNlLCBVc2VyU2VydmljZSwgREFTSEJPQVJEKXtcclxuICAgICAgdmFyIFNldHRpbmdzID0gc2V0dGluZ3MuZGF0YTtcclxuICAgICAgdmFyIHVzZXIgPSBjdXJyZW50VXNlci5kYXRhO1xyXG4gICAgICAkc2NvcGUudXNlciA9IHVzZXI7XHJcblxyXG4gICAgICAkc2NvcGUuREFTSEJPQVJEID0gREFTSEJPQVJEO1xyXG4gICAgICBcclxuICAgICAgZm9yICh2YXIgbXNnIGluICRzY29wZS5EQVNIQk9BUkQpIHtcclxuICAgICAgICBpZiAoJHNjb3BlLkRBU0hCT0FSRFttc2ddLmluY2x1ZGVzKCdbQVBQX0RFQURMSU5FXScpKSB7XHJcbiAgICAgICAgICAkc2NvcGUuREFTSEJPQVJEW21zZ10gPSAkc2NvcGUuREFTSEJPQVJEW21zZ10ucmVwbGFjZSgnW0FQUF9ERUFETElORV0nLCBVdGlscy5mb3JtYXRUaW1lKFNldHRpbmdzLnRpbWVDbG9zZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoJHNjb3BlLkRBU0hCT0FSRFttc2ddLmluY2x1ZGVzKCdbQ09ORklSTV9ERUFETElORV0nKSkge1xyXG4gICAgICAgICAgJHNjb3BlLkRBU0hCT0FSRFttc2ddID0gJHNjb3BlLkRBU0hCT0FSRFttc2ddLnJlcGxhY2UoJ1tDT05GSVJNX0RFQURMSU5FXScsIFV0aWxzLmZvcm1hdFRpbWUodXNlci5zdGF0dXMuY29uZmlybUJ5KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBJcyByZWdpc3RyYXRpb24gb3Blbj9cclxuICAgICAgdmFyIHJlZ0lzT3BlbiA9ICRzY29wZS5yZWdJc09wZW4gPSBVdGlscy5pc1JlZ09wZW4oU2V0dGluZ3MpO1xyXG5cclxuICAgICAgLy8gSXMgaXQgcGFzdCB0aGUgdXNlcidzIGNvbmZpcm1hdGlvbiB0aW1lP1xyXG4gICAgICB2YXIgcGFzdENvbmZpcm1hdGlvbiA9ICRzY29wZS5wYXN0Q29uZmlybWF0aW9uID0gVXRpbHMuaXNBZnRlcih1c2VyLnN0YXR1cy5jb25maXJtQnkpO1xyXG5cclxuICAgICAgJHNjb3BlLmRhc2hTdGF0ZSA9IGZ1bmN0aW9uKHN0YXR1cyl7XHJcbiAgICAgICAgdmFyIHVzZXIgPSAkc2NvcGUudXNlcjtcclxuICAgICAgICBzd2l0Y2ggKHN0YXR1cykge1xyXG4gICAgICAgICAgY2FzZSAndW52ZXJpZmllZCc6XHJcbiAgICAgICAgICAgIHJldHVybiAhdXNlci52ZXJpZmllZDtcclxuICAgICAgICAgIGNhc2UgJ29wZW5BbmRJbmNvbXBsZXRlJzpcclxuICAgICAgICAgICAgcmV0dXJuIHJlZ0lzT3BlbiAmJiB1c2VyLnZlcmlmaWVkICYmICF1c2VyLnN0YXR1cy5jb21wbGV0ZWRQcm9maWxlO1xyXG4gICAgICAgICAgY2FzZSAnb3BlbkFuZFN1Ym1pdHRlZCc6XHJcbiAgICAgICAgICAgIHJldHVybiByZWdJc09wZW4gJiYgdXNlci5zdGF0dXMuY29tcGxldGVkUHJvZmlsZSAmJiAhdXNlci5zdGF0dXMuYWRtaXR0ZWQ7XHJcbiAgICAgICAgICBjYXNlICdjbG9zZWRBbmRJbmNvbXBsZXRlJzpcclxuICAgICAgICAgICAgcmV0dXJuICFyZWdJc09wZW4gJiYgIXVzZXIuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGUgJiYgIXVzZXIuc3RhdHVzLmFkbWl0dGVkO1xyXG4gICAgICAgICAgY2FzZSAnY2xvc2VkQW5kU3VibWl0dGVkJzogLy8gV2FpdGxpc3RlZCBTdGF0ZVxyXG4gICAgICAgICAgICByZXR1cm4gIXJlZ0lzT3BlbiAmJiB1c2VyLnN0YXR1cy5jb21wbGV0ZWRQcm9maWxlICYmICF1c2VyLnN0YXR1cy5hZG1pdHRlZDtcclxuICAgICAgICAgIGNhc2UgJ2FkbWl0dGVkQW5kQ2FuQ29uZmlybSc6XHJcbiAgICAgICAgICAgIHJldHVybiAhcGFzdENvbmZpcm1hdGlvbiAmJlxyXG4gICAgICAgICAgICAgIHVzZXIuc3RhdHVzLmFkbWl0dGVkICYmXHJcbiAgICAgICAgICAgICAgIXVzZXIuc3RhdHVzLmNvbmZpcm1lZCAmJlxyXG4gICAgICAgICAgICAgICF1c2VyLnN0YXR1cy5kZWNsaW5lZDtcclxuICAgICAgICAgIGNhc2UgJ2FkbWl0dGVkQW5kQ2Fubm90Q29uZmlybSc6XHJcbiAgICAgICAgICAgIHJldHVybiBwYXN0Q29uZmlybWF0aW9uICYmXHJcbiAgICAgICAgICAgICAgdXNlci5zdGF0dXMuYWRtaXR0ZWQgJiZcclxuICAgICAgICAgICAgICAhdXNlci5zdGF0dXMuY29uZmlybWVkICYmXHJcbiAgICAgICAgICAgICAgIXVzZXIuc3RhdHVzLmRlY2xpbmVkO1xyXG4gICAgICAgICAgY2FzZSAnY29uZmlybWVkJzpcclxuICAgICAgICAgICAgcmV0dXJuIHVzZXIuc3RhdHVzLmFkbWl0dGVkICYmIHVzZXIuc3RhdHVzLmNvbmZpcm1lZCAmJiAhdXNlci5zdGF0dXMuZGVjbGluZWQ7XHJcbiAgICAgICAgICBjYXNlICdkZWNsaW5lZCc6XHJcbiAgICAgICAgICAgIHJldHVybiB1c2VyLnN0YXR1cy5kZWNsaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLnNob3dXYWl0bGlzdCA9ICFyZWdJc09wZW4gJiYgdXNlci5zdGF0dXMuY29tcGxldGVkUHJvZmlsZSAmJiAhdXNlci5zdGF0dXMuYWRtaXR0ZWQ7XHJcblxyXG4gICAgICAkc2NvcGUucmVzZW5kRW1haWwgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIEF1dGhTZXJ2aWNlXHJcbiAgICAgICAgICAucmVzZW5kVmVyaWZpY2F0aW9uRW1haWwoKVxyXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgc3dlZXRBbGVydCgnWW91ciBlbWFpbCBoYXMgYmVlbiBzZW50LicpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG5cclxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgLy8gVGV4dCFcclxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgdmFyIGNvbnZlcnRlciA9IG5ldyBzaG93ZG93bi5Db252ZXJ0ZXIoKTtcclxuICAgICAgJHNjb3BlLmFjY2VwdGFuY2VUZXh0ID0gJHNjZS50cnVzdEFzSHRtbChjb252ZXJ0ZXIubWFrZUh0bWwoU2V0dGluZ3MuYWNjZXB0YW5jZVRleHQpKTtcclxuICAgICAgJHNjb3BlLmNvbmZpcm1hdGlvblRleHQgPSAkc2NlLnRydXN0QXNIdG1sKGNvbnZlcnRlci5tYWtlSHRtbChTZXR0aW5ncy5jb25maXJtYXRpb25UZXh0KSk7XHJcbiAgICAgICRzY29wZS53YWl0bGlzdFRleHQgPSAkc2NlLnRydXN0QXNIdG1sKGNvbnZlcnRlci5tYWtlSHRtbChTZXR0aW5ncy53YWl0bGlzdFRleHQpKTtcclxuXHJcblxyXG4gICAgICAkc2NvcGUuZGVjbGluZUFkbWlzc2lvbiA9IGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgdGl0bGU6IFwiV2hvYSFcIixcclxuICAgICAgICAgIHRleHQ6IFwiQXJlIHlvdSBzdXJlIHlvdSB3b3VsZCBsaWtlIHRvIGRlY2xpbmUgeW91ciBhZG1pc3Npb24/IFxcblxcbiBZb3UgY2FuJ3QgZ28gYmFjayFcIixcclxuICAgICAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxyXG4gICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcclxuICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogXCIjREQ2QjU1XCIsXHJcbiAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogXCJZZXMsIEkgY2FuJ3QgbWFrZSBpdC5cIixcclxuICAgICAgICAgIGNsb3NlT25Db25maXJtOiB0cnVlXHJcbiAgICAgICAgICB9LCBmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAgICAgICAuZGVjbGluZUFkbWlzc2lvbih1c2VyLl9pZClcclxuICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbih1c2VyKXtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSB1c2VyO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSB1c2VyO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLmNvbnRyb2xsZXIoJ1RlYW1DdHJsJywgW1xyXG4gICAgJyRzY29wZScsXHJcbiAgICAnY3VycmVudFVzZXInLFxyXG4gICAgJ3NldHRpbmdzJyxcclxuICAgICdVdGlscycsXHJcbiAgICAnVXNlclNlcnZpY2UnLFxyXG4gICAgJ1RFQU0nLFxyXG4gICAgZnVuY3Rpb24oJHNjb3BlLCBjdXJyZW50VXNlciwgc2V0dGluZ3MsIFV0aWxzLCBVc2VyU2VydmljZSwgVEVBTSl7XHJcbiAgICAgIC8vIEdldCB0aGUgY3VycmVudCB1c2VyJ3MgbW9zdCByZWNlbnQgZGF0YS5cclxuICAgICAgdmFyIFNldHRpbmdzID0gc2V0dGluZ3MuZGF0YTtcclxuXHJcbiAgICAgICRzY29wZS5yZWdJc09wZW4gPSBVdGlscy5pc1JlZ09wZW4oU2V0dGluZ3MpO1xyXG5cclxuICAgICAgJHNjb3BlLnVzZXIgPSBjdXJyZW50VXNlci5kYXRhO1xyXG5cclxuICAgICAgJHNjb3BlLlRFQU0gPSBURUFNO1xyXG5cclxuICAgICAgZnVuY3Rpb24gX3BvcHVsYXRlVGVhbW1hdGVzKCkge1xyXG4gICAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgICAuZ2V0TXlUZWFtbWF0ZXMoKVxyXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IG51bGw7XHJcbiAgICAgICAgICAgICRzY29wZS50ZWFtbWF0ZXMgPSBkYXRhLnRlYW1tYXRlcztcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoJHNjb3BlLnVzZXIudGVhbUNvZGUpe1xyXG4gICAgICAgIF9wb3B1bGF0ZVRlYW1tYXRlcygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkc2NvcGUuam9pblRlYW0gPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGlmKCRzY29wZS5jb2RlICYmICRzY29wZS5jb2RlICE9ICcnKXtcclxuICAgICAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgICAgIC5qb2luT3JDcmVhdGVUZWFtKCRzY29wZS5jb2RlKVxyXG4gICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbih1c2VyKXtcclxuICAgICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xyXG4gICAgICAgICAgICAgICRzY29wZS51c2VyID0gdXNlcjtcclxuICAgICAgICAgICAgICBfcG9wdWxhdGVUZWFtbWF0ZXMoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKHJlcyl7XHJcbiAgICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzLm1lc3NhZ2U7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBcIlBsZWFzZSBlbnRlciBhIHRlYW0gbmFtZVwiXHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLmxlYXZlVGVhbSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAgIC5sZWF2ZVRlYW0oKVxyXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24odXNlcil7XHJcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IG51bGw7XHJcbiAgICAgICAgICAgICRzY29wZS51c2VyID0gdXNlcjtcclxuICAgICAgICAgICAgJHNjb3BlLnRlYW1tYXRlcyA9IFtdO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5lcnJvcihmdW5jdGlvbihyZXMpe1xyXG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXMuZGF0YS5tZXNzYWdlO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgfV0pO1xyXG4iXX0=
