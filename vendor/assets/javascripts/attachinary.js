(function () {
  (function ($) {
    $.attachinary = {
      index: 0,
      config: {
        disableWith: "Uploading...",
        indicateProgress: true,
        invalidFormatMessage: "Invalid file format",
        template:
          '<ul>\n  <% for(var i=0; i<files.length; i++){ %>\n    <li>\n      <% if(files[i].resource_type == "raw") { %>\n        <div class="raw-file"></div>\n      <% } else { %>\n        <img\n          src="<%= $.cloudinary.url(files[i].public_id, { "version": files[i].version, "format": \'jpg\', "crop": \'fill\', "width": 75, "height": 75 }) %>"\n          alt="" width="75" height="75" />\n      <% } %>\n      <a href="#" data-remove="<%= files[i].public_id %>">Remove</a>\n    </li>\n  <% } %>\n</ul>',
        render: function (files) {
          return $.attachinary.Templating.template(this.template, {
            files: files,
          });
        },
      },
    };
    $.fn.attachinary = function (options) {
      var settings;
      settings = $.extend({}, $.attachinary.config, options);
      return this.each(function () {
        var $this;
        $this = $(this);
        if (!$this.data("attachinary-bond")) {
          return $this.data(
            "attachinary-bond",
            new $.attachinary.Attachinary($this, settings)
          );
        }
      });
    };
    $.attachinary.Attachinary = (function () {
      function Attachinary($input1, config) {
        var ref;
        this.$input = $input1;
        this.config = config;
        this.options = this.$input.data("attachinary");
        this.files = this.options.files;
        this.$form = this.$input.closest("form");
        this.$submit = this.$form.find(
          (ref = this.options.submit_selector) != null
            ? ref
            : "input[type=submit]"
        );
        if (this.options.wrapper_container_selector != null) {
          this.$wrapper = this.$input.closest(
            this.options.wrapper_container_selector
          );
        }
        this.initFileUpload();
        this.addFilesContainer();
        this.bindEventHandlers();
        this.redraw();
        this.checkMaximum();
      }

      Attachinary.prototype.initFileUpload = function () {
        var options;
        this.options.field_name = this.$input.attr("name");
        options = {
          dataType: "json",
          paramName: "file",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
          dropZone: this.config.dropZone || this.$input,
          sequentialUploads: true,
        };
        if (this.$input.attr("accept")) {
          options.acceptFileTypes = new RegExp(
            "^" + this.$input.attr("accept").split(",").join("|") + "$",
            "i"
          );
        }
        return this.$input.fileupload(options);
      };

      Attachinary.prototype.bindEventHandlers = function () {
        this.$input.bind(
          "fileuploadsend",
          (function (_this) {
            return function (event, data) {
              _this.$input.addClass("uploading");
              if (_this.$wrapper != null) {
                _this.$wrapper.addClass("uploading");
              }
              _this.$form.addClass("uploading");
              _this.$input.prop("disabled", true);
              if (_this.config.disableWith) {
                _this.$submit.each(function (index, input) {
                  var $input;
                  $input = $(input);
                  if ($input.data("old-val") == null) {
                    return $input.data("old-val", $input.val());
                  }
                });
                _this.$submit.val(_this.config.disableWith);
                _this.$submit.prop("disabled", true);
              }
              return !_this.maximumReached();
            };
          })(this)
        );
        this.$input.bind(
          "fileuploaddone",
          (function (_this) {
            return function (event, data) {
              return _this.addFile(data.result);
            };
          })(this)
        );
        this.$input.bind(
          "fileuploadstart",
          (function (_this) {
            return function (event) {
              return (_this.$input = $(event.target));
            };
          })(this)
        );
        this.$input.bind(
          "fileuploadalways",
          (function (_this) {
            return function (event) {
              _this.$input.removeClass("uploading");
              if (_this.$wrapper != null) {
                _this.$wrapper.removeClass("uploading");
              }
              _this.$form.removeClass("uploading");
              _this.checkMaximum();
              if (_this.config.disableWith) {
                _this.$submit.each(function (index, input) {
                  var $input;
                  $input = $(input);
                  return $input.val($input.data("old-val"));
                });
                return _this.$submit.prop("disabled", false);
              }
            };
          })(this)
        );
        return this.$input.bind(
          "fileuploadprogressall",
          (function (_this) {
            return function (e, data) {
              var progress;
              progress = parseInt((data.loaded / data.total) * 100, 10);
              if (_this.config.disableWith && _this.config.indicateProgress) {
                return _this.$submit.val(
                  "[" + progress + "%] " + _this.config.disableWith
                );
              }
            };
          })(this)
        );
      };

      Attachinary.prototype.addFile = function (file) {
        if (
          !this.options.accept ||
          $.inArray(file.format, this.options.accept) !== -1 ||
          $.inArray(file.resource_type, this.options.accept) !== -1
        ) {
          this.files.push(file);
          this.redraw();
          this.checkMaximum();
          return this.$input.trigger("attachinary:fileadded", [file]);
        } else {
          return alert(this.config.invalidFormatMessage);
        }
      };

      Attachinary.prototype.removeFile = function (fileIdToRemove) {
        var _files, file, i, len, ref, removedFile;
        _files = [];
        removedFile = null;
        ref = this.files;
        for (i = 0, len = ref.length; i < len; i++) {
          file = ref[i];
          if (file.public_id === fileIdToRemove) {
            removedFile = file;
          } else {
            _files.push(file);
          }
        }
        this.files = _files;
        this.redraw();
        this.checkMaximum();
        return this.$input.trigger("attachinary:fileremoved", [removedFile]);
      };

      Attachinary.prototype.checkMaximum = function () {
        if (this.maximumReached()) {
          if (this.$wrapper != null) {
            this.$wrapper.addClass("disabled");
          }
          return this.$input.prop("disabled", true);
        } else {
          if (this.$wrapper != null) {
            this.$wrapper.removeClass("disabled");
          }
          return this.$input.prop("disabled", false);
        }
      };

      Attachinary.prototype.maximumReached = function () {
        return (
          this.options.maximum && this.files.length >= this.options.maximum
        );
      };

      Attachinary.prototype.addFilesContainer = function () {
        if (
          this.options.files_container_selector != null &&
          $(this.options.files_container_selector).length > 0
        ) {
          return (this.$filesContainer = $(
            this.options.files_container_selector
          ));
        } else {
          this.$filesContainer = $('<div class="attachinary_container">');
          return this.$input.after(this.$filesContainer);
        }
      };

      Attachinary.prototype.redraw = function () {
        this.$filesContainer.empty();
        if (this.files.length > 0) {
          this.$filesContainer.append(
            this.makeHiddenField(JSON.stringify(this.files))
          );
          this.$filesContainer.append(this.config.render(this.files));
          this.$filesContainer.find("[data-remove]").on(
            "click",
            (function (_this) {
              return function (event) {
                event.preventDefault();
                return _this.removeFile($(event.target).data("remove"));
              };
            })(this)
          );
          return this.$filesContainer.show();
        } else {
          this.$filesContainer.append(this.makeHiddenField(null));
          return this.$filesContainer.hide();
        }
      };

      Attachinary.prototype.makeHiddenField = function (value) {
        var $input;
        $input = $('<input type="hidden">');
        $input.attr("name", this.options.field_name);
        $input.val(value);
        return $input;
      };

      return Attachinary;
    })();
    return ($.attachinary.Templating = {
      settings: {
        start: "<%",
        end: "%>",
        interpolate: /<%=(.+?)%>/g,
      },
      escapeRegExp: function (string) {
        return string.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1");
      },
      template: function (str, data) {
        var c, endMatch, fn;
        c = this.settings;
        endMatch = new RegExp(
          "'(?=[^" + c.end.substr(0, 1) + "]*" + this.escapeRegExp(c.end) + ")",
          "g"
        );
        fn = new Function(
          "obj",
          "var p=[],print=function(){p.push.apply(p,arguments);};" +
            "with(obj||{}){p.push('" +
            str
              .replace(/\r/g, "\\r")
              .replace(/\n/g, "\\n")
              .replace(/\t/g, "\\t")
              .replace(endMatch, "✄")
              .split("'")
              .join("\\'")
              .split("✄")
              .join("'")
              .replace(c.interpolate, "',$1,'")
              .split(c.start)
              .join("');")
              .split(c.end)
              .join("p.push('") +
            "');}return p.join('');"
        );
        if (data) {
          return fn(data);
        } else {
          return fn;
        }
      },
    });
  })(jQuery);
}).call(this);
