/*!
 * WPBakery Page Builder v6.0.0 (https://wpbakery.com)
 * Copyright 2011-2020 Michael M, WPBakery
 * License: Commercial. More details: http://go.wpbakery.com/licensing
 */

// jscs:disable
// jshint ignore: start

_.isUndefined(window.vc) && (window.vc = {
        atts: {}
    }),
    function($) {
        "use strict";
        var VcColumnOffsetParam = Backbone.View.extend({
            events: {},
            $lg_offset_placeholder_value: !1,
            $lg_size_placeholder_value: !1,
            initialize: function() {
                _.bindAll(this, "setLgPlaceholders")
            },
            render: function() {
                return this
            },
            save: function() {
                var data = [];
                return this.$el.find(".vc_column_offset_field").each(function() {
                    var $field = $(this);
                    $field.is(":checkbox:checked") ? data.push($field.attr("name")) : $field.is("select") && "" !== $field.val() && data.push($field.val())
                }), data
            },
            setLgPlaceholders: function() {
                var offset = this.$lg_offset_placeholder_value.val().replace(/[^\d]/g, "");
                this.$lg_size.find("option:first").text(VcI8nColumnOffsetParam.inherit_default), this.$lg_offset.find("option:first").text(offset ? VcI8nColumnOffsetParam.inherit + offset : "")
            }
        });
        vc.atts.column_offset = {
            parse: function(param) {
                return this.content().find("input.wpb_vc_param_value." + param.param_name).data("vcColumnOffset").save().join(" ")
            },
            init: function(param, $field) {
                $('[data-column-offset="true"]', $field).each(function() {
                    var $this = $(this);
                    $this.find(".wpb_vc_param_value").data("vcColumnOffset", new VcColumnOffsetParam({
                        el: $this
                    }).render())
                })
            }
        }
    }(window.jQuery), _.isUndefined(window.vc) && (window.vc = {
        atts: {}
    }),
    function($) {
        "use strict";
        var media, preloader_url, VcCssEditor;
        media = wp.media, preloader_url = ajaxurl.replace(/admin\-ajax\.php/, "images/wpspin_light.gif"), media.controller.VcCssSingleImage = media.controller.VcSingleImage.extend({
            setCssEditor: function(view) {
                return view && (this._css_editor = view), this
            },
            updateSelection: function() {
                var attachments, selection = this.get("selection"),
                    ids = this._css_editor.getBackgroundImage();
                void 0 !== ids && "" !== ids && -1 !== ids && (attachments = _.map(ids.toString().split(/,/), function(attachment) {
                    attachment = wp.media.model.Attachment.get(attachment);
                    return attachment.fetch(), attachment
                })), selection.reset(attachments)
            }
        }), VcCssEditor = vc.CssEditor = Backbone.View.extend({
            attrs: {},
            layouts: ["margin", "border-width", "padding"],
            positions: ["top", "right", "bottom", "left"],
            $field: !1,
            simplify: !1,
            $simplify: !1,
            events: {
                "click .vc_icon-remove": "removeImage",
                "click .vc_add-image": "addBackgroundImage",
                "change .vc_simplify": "changeSimplify"
            },
            initialize: function() {
                _.bindAll(this, "setSimplify")
            },
            render: function(value) {
                return this.attrs = {}, this.$simplify = this.$el.find(".vc_simplify"), _.isString(value) && this.parse(value), this
            },
            parse: function(data_split) {
                data_split = data_split.split(/\s*(\.[^\{]+)\s*\{\s*([^\}]+)\s*\}\s*/g);
                data_split && data_split[2] && this.parseAtts(data_split[2].replace(/\s+!important/g, ""))
            },
            addBackgroundImage: function(e) {
                if (e && e.preventDefault && e.preventDefault(), window.vc_selectedFilters = {}, this.image_media) return this.image_media.open("vc_editor");
                this.image_media = media({
                    state: "vc_single-image",
                    states: [(new media.controller.VcCssSingleImage).setCssEditor(this)]
                }), this.image_media.on("toolbar:create:vc_single-image", function(toolbar) {
                    this.createSelectToolbar(toolbar, {
                        text: window.i18nLocale.set_image
                    })
                }, this.image_media), this.image_media.state("vc_single-image").on("select", this.setBgImage), this.image_media.open("vc_editor")
            },
            setBgImage: function() {
                ! function(selection, obj) {
                    var ids;
                    ids = [], $(".media-modal").addClass("processing-media"), selection.each(function(model) {
                            ids.push(model.get("id"))
                        }),
                        function(ids, callback) {
                            $.ajax({
                                dataType: "json",
                                type: "POST",
                                url: window.ajaxurl,
                                data: {
                                    action: "vc_media_editor_add_image",
                                    filters: window.vc_selectedFilters,
                                    ids: ids,
                                    vc_inline: !0,
                                    _vcnonce: window.vcAdminNonce
                                }
                            }).done(function(response) {
                                var attachments, attachment, promises, i;
                                if ("function" == typeof callback) {
                                    for (attachments = [], promises = [], i = 0; i < response.data.ids.length; i++) attachment = wp.media.model.Attachment.get(response.data.ids[i]), promises.push(attachment.fetch()), attachments.push(attachment);
                                    $.when.apply($, promises).done(function() {
                                        callback(attachments)
                                    })
                                }
                            }).fail(function(response) {
                                $(".media-modal-close").click(), window.vc && window.vc.active_panel && window.i18nLocale && window.i18nLocale.error_while_saving_image_filtered && vc.active_panel.showMessage(window.i18nLocale.error_while_saving_image_filtered, "error"), window.console && window.console.warn && window.console.warn("css_editor processImages error", response)
                            }).always(function() {
                                $(".media-modal").removeClass("processing-media")
                            })
                        }(ids, function(objects) {
                            if (!window.vc || !window.vc.active_panel) return !1;
                            var template = _.map(objects, function(newAttachment) {
                                return newAttachment.attributes
                            });
                            selection.reset(template), objects = _.map(selection.models, function(model) {
                                return model.attributes
                            }), template = vc.template($("#vc_css-editor-image-block").html(), _.defaults({}, {
                                variable: "img"
                            }, vc.templateOptions.custom)), obj._css_editor.$el.find(".vc_background-image .vc_image").html(template(objects[0])), $(".media-modal").removeClass("processing-media")
                        })
                }(this.get("selection"), this)
            },
            setCurrentBgImage: function(value) {
                var url, template, image_split = /([^\?]+)(\?id=\d+){0,1}/,
                    id = "";
                value.match(/^\d+$/) ? (template = vc.template($("#vc_css-editor-image-block").html(), _.defaults({}, {
                    variable: "img"
                }, vc.templateOptions.custom)), this.$el.find(".vc_background-image .vc_image").html(template({
                    url: preloader_url,
                    id: value,
                    css_class: "vc_preview"
                })), $.ajax({
                    type: "POST",
                    url: window.ajaxurl,
                    data: {
                        action: "wpb_single_image_src",
                        content: value,
                        size: "full",
                        _vcnonce: window.vcAdminNonce
                    },
                    dataType: "html",
                    context: this
                }).done(function(url) {
                    this.$el.find(".vc_ce-image").attr("src", url + "?id=" + value).removeClass("vc_preview")
                })) : value.match(image_split) && (url = (image_split = value.split(image_split))[1], image_split[2] && (id = image_split[2].replace(/[^\d]+/, "")), template = vc.template($("#vc_css-editor-image-block").html(), _.defaults({}, {
                    variable: "img"
                }, vc.templateOptions.custom)), this.$el.find(".vc_background-image .vc_image").html(template({
                    url: url,
                    id: id
                })))
            },
            changeSimplify: function() {
                _.debounce(this.setSimplify, 100)()
            },
            setSimplify: function() {
                this.simplifiedMode(this.$simplify[0].checked)
            },
            simplifiedMode: function(enable) {
                enable ? (this.simplify = !0, this.$el.addClass("vc_simplified")) : (this.simplify = !1, this.$el.removeClass("vc_simplified"), _.each(this.layouts, function(attr) {
                    "border-width" === attr && (attr = "border");
                    var $control = $("[data-attribute=" + attr + "].vc_top");
                    this.$el.find("[data-attribute=" + attr + "]:not(.vc_top)").val($control.val())
                }, this))
            },
            removeImage: function(e) {
                var $control = $(e.currentTarget);
                e && e.preventDefault && e.preventDefault(), $control.parent().remove()
            },
            getBackgroundImage: function() {
                return this.$el.find(".vc_ce-image").data("imageId")
            },
            parseAtts: function(string) {
                var border_regex = /(\d+\S*)\s+(\w+)\s+([\d\w#\(,]+)/,
                    background_regex = /^([^\s]+)\s+url\(([^\)]+)\)([\d\w]+\s+[\d\w]+)?$/,
                    background_size = !1;
                _.map(string.split(";"), function(value) {
                    var val_pos, border_split, val_s = value.split(/:\s/),
                        value = val_s[1] || "",
                        name = val_s[0] || "",
                        value = value && value.trim();
                    name.match(new RegExp("^(" + this.layouts.join("|").replace("-", "\\-") + ")$")) && value ? (1 === (val_pos = value.split(/\s+/g)).length ? val_pos = [val_pos[0], val_pos[0], val_pos[0], val_pos[0]] : 2 === val_pos.length ? (val_pos[2] = val_pos[0], val_pos[3] = val_pos[1]) : 3 === val_pos.length && (val_pos[3] = val_pos[1]), _.each(this.positions, function(pos, key) {
                        this.$el.find("[data-name=" + name + "-" + pos + "]").val(val_pos[key])
                    }, this)) : "background-size" === name ? (background_size = value, this.$el.find("[name=background_style]").val(value)) : "background-repeat" !== name || background_size ? "background-image" === name ? this.setCurrentBgImage(value.replace(/url\(([^\)]+)\)/, "$1")) : "background" === name && value ? ((border_split = value.split(background_regex)) && border_split[1] && this.$el.find("[name=" + name + "_color]").val(border_split[1]), border_split && border_split[2] && this.setCurrentBgImage(border_split[2])) : "border" === name && value && value.match(border_regex) ? (border_split = value.split(border_regex), val_pos = [border_split[1], border_split[1], border_split[1], border_split[1]], _.each(this.positions, function(pos, key) {
                        this.$el.find("[name=" + name + "_" + pos + "_width]").val(val_pos[key])
                    }, this), this.$el.find("[name=border_style]").val(border_split[2]), this.$el.find("[name=border_color]").val(border_split[3]).trigger("change")) : -1 != name.indexOf("border") && value ? -1 != name.indexOf("style") ? this.$el.find("[name=border_style]").val(value) : -1 != name.indexOf("color") ? this.$el.find("[name=border_color]").val(value).trigger("change") : -1 != name.indexOf("radius") ? this.$el.find("[name=border_radius]").val(value) : name.match(/^[\w\-\d]+$/) && this.$el.find("[name=" + name.replace(/\-+/g, "_") + "]").val(value) : name.match(/^[\w\-\d]+$/) && value && this.$el.find("[name=" + name.replace(/\-+/g, "_") + "]").val(value) : this.$el.find("[name=background_style]").val(value)
                }, this)
            },
            save: function() {
                var string = "";
                return this.attrs = {}, _.each(this.layouts, function(type) {
                    this.getFields(type)
                }, this), this.getBackground(), this.getBorder(), _.isEmpty(this.attrs) || (string = ".vc_custom_" + Date.now() + "{" + _.reduce(this.attrs, function(memo, value, key) {
                    return value ? memo + key + ": " + value + " !important;" : memo
                }, "", this) + "}"), string && vc.frame_window && vc.frame_window.vc_iframe.setCustomShortcodeCss(string), string
            },
            getBackgroundImageSrc: function() {
                return this.$el.find(".vc_background-image img").attr("src")
            },
            getBackgroundColor: function() {
                return this.$el.find("[name=background_color]").val()
            },
            getBackgroundStyle: function() {
                return this.$el.find("[name=background_style]").val()
            },
            getBackground: function() {
                var color = this.getBackgroundColor(),
                    image = this.getBackgroundImageSrc(),
                    style = this.getBackgroundStyle();
                color && image ? this.attrs.background = color + " url(" + image + ")" : color ? this.attrs["background-color"] = color : image && (this.attrs["background-image"] = "url(" + image + ")"), style.match(/repeat/) ? (this.attrs["background-position"] = "0 0", this.attrs["background-repeat"] = style) : style.match(/cover|contain/) && (this.attrs["background-position"] = "center", this.attrs["background-repeat"] = "no-repeat", this.attrs["background-size"] = style), color.match(/^rgba/) && (this.attrs["*background-color"] = color.replace(/\s+/, "").replace(/(rgb)a\((\d+)\,(\d+),(\d+),[^\)]+\)/, "$1($2,$3,$4)"))
            },
            getBorder: function() {
                var style = this.$el.find("[name=border_style]").val(),
                    radius = this.$el.find("[name=border_radius]").val(),
                    color = this.$el.find("[name=border_color]").val();
                this.attrs["border-width"] && this.attrs["border-width"].match(/^\d+\S+$/) ? (this.attrs.border = this.attrs["border-width"] + " " + (style || "initial") + " " + color, this.attrs["border-width"] = void 0) : _.each(["left", "right", "top", "bottom"], function(side) {
                    this.attrs["border-" + side + "-width"] && (color && (this.attrs["border-" + side + "-color"] = color), style && (this.attrs["border-" + side + "-style"] = style))
                }, this), radius && (this.attrs["border-radius"] = radius)
            },
            getFields: function(type) {
                var data = [];
                if (this.simplify) return this.getSimplifiedField(type);
                _.each(this.positions, function(pos) {
                    var val = this.$el.find("[data-name=" + type + "-" + pos + "]").val().replace(/\s+/, "");
                    val.match(/^-?\d*(\.\d+){0,1}(%|in|cm|mm|em|rem|ex|pt|pc|px|vw|vh|vmin|vmax)$/) || (val = isNaN(parseFloat(val)) ? "" : parseFloat(val) + "px"), val && val.length && data.push({
                        name: pos,
                        val: val
                    })
                }, this), _.each(data, function(attr) {
                    var attr_name = "border-width" === type ? "border-" + attr.name + "-width" : type + "-" + attr.name;
                    this.attrs[attr_name] = attr.val
                }, this)
            },
            getSimplifiedField: function(type) {
                var val = this.$el.find("[data-name=" + type + "-top]").val().replace(/\s+/, "");
                val.match(/^-?\d*(\.\d+){0,1}(%|in|cm|mm|em|rem|ex|pt|pc|px|vw|vh|vmin|vmax)$/) || (val = isNaN(parseFloat(val)) ? "" : parseFloat(val) + "px"), val.length && (this.attrs[type] = val)
            }
        }), vc.atts.css_editor = {
            parse: function(param) {
                return this.content().find('input.wpb_vc_param_value[name="' + param.param_name + '"]').data("vcFieldManager").save()
            },
            init: function(param, $field) {
                $("[data-css-editor=true]", this.content()).each(function() {
                    var params, cssString, $editor = $(this),
                        $param = $editor.find('input.wpb_vc_param_value[name="' + param.param_name + '"]'),
                        value = $param.val();
                    value || (cssString = {
                        bg_color: "background-color",
                        padding: "padding",
                        margin_bottom: "margin-bottom",
                        bg_image: "background-image"
                    }, params = vc.edit_element_block_view.model.get("params"), value = (cssString = _.reduce(cssString, function(memo, css_name, attr_name) {
                        var value = params[attr_name];
                        return _.isUndefined(value) || !value.length ? memo : ("bg_image" === attr_name && (value = "url(" + value + ")"), memo + css_name + ": " + value + ";")
                    }, "")) ? ".tmp_class{" + cssString + "}" : ""), $param.data("vcFieldManager", new VcCssEditor({
                        el: $editor
                    }).render(value))
                }), vc.atts.colorpicker.init.call(this, param, $field)
            }
        }
    }(window.jQuery), _.isUndefined(window.vc) && (window.vc = {
        atts: {}
    }),
    function($) {
        "use strict";
        var ParamsPresetView = Backbone.View.extend({
            events: {
                change: "setParams"
            },
            setParams: function() {
                var fields, data = this.save(),
                    data = this.$el.find('[value="' + data + '"]'),
                    $edit_form = vc.edit_element_block_view.content(),
                    $params_preset = this.$el;
                data.length && (data = data.data("params"), fields = [], _.each(data, function(value, fieldManager, list) {
                    var $field = $edit_form.find("[name=" + fieldManager + "].wpb_vc_param_value");
                    $field.length && ($field.unbind("change.vcParamsPreset"), (fieldManager = $field.data("vcFieldManager")) && fieldManager.render && fieldManager.render(value), fields.push($field), $field.val(value).trigger("change"))
                }), _.each(fields, function(value, key) {
                    value.bind("change.vcParamsPreset", function(e) {
                        _.isUndefined(e.extra_type) && $params_preset.val("")
                    })
                }))
            },
            render: function() {
                return this.setParams(), this
            },
            save: function() {
                return this.$el.val()
            }
        });
        vc.atts.params_preset = {
            parse: function(param) {
                return $("select[name=" + param.param_name + "]", this.content()).val()
            },
            init: function(param, $field) {
                $(".vc_params-preset-select", $field).each(function() {
                    var $this = $(this);
                    _.isUndefined($this.data("fieldManager")) && $this.data("fieldManager", new ParamsPresetView({
                        el: $this
                    }).render())
                })
            }
        }
    }(window.jQuery),
    function($) {
        "use strict";
        new function() {
            $(".gallery_widget_attached_images_list", this.$view).off("click.removeImage").on("click.removeImage", "a.vc_icon-remove", function($block) {
                $block.preventDefault();
                $block = $(this).closest(".edit_form_line");
                $(this).parent().remove();
                var img_ids = [];
                $block.find(".added img").each(function() {
                    img_ids.push($(this).attr("rel"))
                }), $block.find(".gallery_widget_attached_images_ids").val(img_ids.join(",")).trigger("change")
            }), $(".gallery_widget_attached_images_list").each(function(index) {
                var $img_ul = $(this);
                $img_ul.sortable({
                    forcePlaceholderSize: !0,
                    placeholder: "widgets-placeholder-gallery",
                    cursor: "move",
                    items: "li",
                    update: function() {
                        var img_ids = [];
                        $(this).find(".added img").each(function() {
                            img_ids.push($(this).attr("rel"))
                        }), $img_ul.closest(".edit_form_line").find(".gallery_widget_attached_images_ids").val(img_ids.join(",")).trigger("change")
                    }
                })
            })
        };
        var $tabs = $("#vc_edit-form-tabs");
        $tabs.length && ($(".wpb-edit-form").addClass("vc_with-tabs"), $tabs.find(".vc_edit-form-tab-control").removeClass("vc_active").eq(0).addClass("vc_active"), $tabs.find('[data-vc-ui-element="panel-edit-element-tab"]').removeClass("vc_active").eq(0).addClass("vc_active"), $tabs.find(".vc_edit-form-link").on("click", function(e) {
            var $this = $(this);
            e.preventDefault(), $tabs.find(".vc_active").removeClass("vc_active"), $this.parent().addClass("vc_active"), $($this.attr("href")).addClass("vc_active").parents(".vc_panel-body").scrollTop(0)
        }))
		//additemlist button
		$(".vc_ui-panel .additembutton").click(function(){
			var listitemwindow = $(this).parent().parent().next().find(".listitemwindow");
			listitemwindow.css({
				"display": "block",
				"top": "220px"
			});
			listitemwindow.find("[name='item_type']").val("items");
			listitemwindow.find("[name='item_value'], [name='item_content'], [name='item_url'], [name='item_content_color'], [name='item_value_color'], [name='item_value_background_color'], [name='item_border_color']").val("");
			listitemwindow.draggable({
				handle: $(".vc_panel-heading")
			});
			listitemwindow.resizable({
				handles: "n, e, s, w, ne, se, sw, nw"
			});
		});
		$(".cancel-item-options, .listitemwindow .vc_close").click(function(event){
			event.preventDefault();
			$(".listitemwindow").css("display", "none");
		});
		$("#add-item-shortcode").click(function(event){
			event.preventDefault();
			var editor = window.tinyMCE.get('wpb_tinymce_content');
			var currentContent = editor.getContent();
			var text_color = $("[name='additemwindow'] [name='item_content_color']");
			var value_color = $("[name='additemwindow'] [name='item_value_color']");
			var value_background_color = $("[name='additemwindow'] [name='item_value_background_color']");
			var border_color = $("[name='additemwindow'] [name='item_border_color']");
			var item = '[item' + ($("[name='additemwindow'] [name='item_type']").length ? ' type="' + $("[name='additemwindow'] [name='item_type']").val() + '"' : '') + ($("[name='additemwindow'] [name='item_value']").length ? ' value="' + $("[name='additemwindow'] [name='item_value']").val() + '"' : '') + ($("[name='additemwindow'] [name='item_url']").length ? ' url="' + $("[name='additemwindow'] [name='item_url']").val() + '"' : '') + ($("[name='additemwindow'] [name='item_url_target']").length ? ' url_target="' + $("[name='additemwindow'] [name='item_url_target']").val() + '"' : '') + ($("[name='additemwindow'] [name='item_icon']").length ? ' icon="' + $("[name='additemwindow'] [name='item_icon']").val() + '"' : '') + (text_color.length!="" ? ' text_color="' + text_color.val() + '"' : '') + (value_color.length!="" ? ' value_color="' + value_color.val() + '"' : '') + (value_background_color.length!="" ? ' value_bg_color="' + value_background_color.val() + '"' : '') + (border_color.length!="" ? ' border_color="' + border_color.val() + '"' : '') + ']' + $("[name='additemwindow'] [name='item_content']").val() + '[/item]';
			editor.setContent($(currentContent).text()+item);
			$(".listitemwindow").css("display", "none");
		});
		//small slider show/hide images dependency fields
		$(".gallery_widget_attached_images_ids").change(function(){
			var val_split = $(this).val().split(",");
			var count = 0;
			if(parseInt(val_split[0]))
				count = val_split.length;
			//$("[data-dependency='images']").css("display", "none");
			var multipler = ($(this).hasClass("carousel_images") ? 5 : ($(this).hasClass("slider_images") ? 3 : 4));
			var nextAll = $(".wpb_el_type_attach_images").nextAll();
			nextAll.slice(0, 30*multipler+1).css("display", "none");
			if(count)
			{
				nextAll.slice(0, count*multipler).css("display", "block");
				nextAll.slice(30*multipler, 30*multipler+1).css("display", "block");
				/*for(var i=0; i<count*multipler; i++)
					$("[data-dependency='images']:eq("+i+")").css("display", "block");*/
				//$("[data-dependency='images']:last").css("display", "block");
			}
			
		});
		setTimeout(function(){
			$(".gallery_widget_attached_images_ids").trigger("change");
		}, 1);
		//testimonials
		$(".vc_ui-panel [name^='testimonials_icon'], .vc_ui-panel [name^='testimonials_title'], .vc_ui-panel [name^='testimonials_author'], .vc_ui-panel [name^='testimonials_author_subtext']").parent().parent().css("display", "none");
		$(".vc_ui-panel [name='testimonials_count']").change(function(){
			var self = $(this);
			var multipler = $(".vc_ui-panel [name$='29']").length;
			$(".vc_ui-panel [name^='testimonials_icon'], .vc_ui-panel [name^='testimonials_title'], .vc_ui-panel [name^='testimonials_author'], .vc_ui-panel [name^='testimonials_author_subtext']").parent().parent().css("display", "none");
			self.parent().parent().nextUntil('', ':lt(' + (self.val()*multipler) + ')').css("display", "block");
		});
		setTimeout(function(){
			$("[name='testimonials_count']").trigger("change");
		}, 1);
		//testimonials
		$(".vc_ui-panel [name^='icon_type'], .vc_ui-panel [name^='icon_url'], .vc_ui-panel [name^='icon_target']").parent().parent().css("display", "none");
		$(".vc_ui-panel [name='icons_count']").change(function(){
			var self = $(this);
			$(".vc_ui-panel [name^='icon_type'], .vc_ui-panel [name^='icon_url'], .vc_ui-panel [name^='icon_target']").parent().parent().css("display", "none");
			self.parent().parent().nextUntil('', ':lt(' + (self.val()*3) + ')').css("display", "block");
		});
		setTimeout(function(){
			$("[name='icons_count']").trigger("change");
		}, 1);
    }(window.jQuery), _.isUndefined(window.vc) && (window.vc = {
        atts: {}
    }),
    function($) {
        "use strict";
        vc.atts.vc_grid_item = {
            init: function(param, $field) {
                !0 === vc_user_access().getState("grid_builder") || null === vc_user_access().getState("grid_builder") ? this.content().find('[data-vc-shortcode-param-name="' + param.param_name + '"] [data-vc-grid-element="value"]').on("change", function() {
                    var value = $(this).val(),
                        url = $(this).find("[value=" + value + "]").data("vcLink");
                    value && $(this).parents('[data-vc-shortcode-param-name="' + param.param_name + '"]:first').find('[data-vc-grid-item="edit_link"]').attr("href", url)
                }).trigger("change") : this.content().find('[data-vc-shortcode-param-name="' + param.param_name + '"] .vc_description').remove()
            },
            parse: function($field) {
                $field = this.content().find('[data-vc-shortcode-param-name="' + $field.param_name + '"] [data-vc-grid-element="value"]');
                return $field.length ? $field.val() : ""
            }
        }
    }(window.jQuery);