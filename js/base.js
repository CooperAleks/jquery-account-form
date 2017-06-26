// Globals
var App = {};
var userID = localStorage.getItem('userID');
var validator, applNumber;
var isMobile = false;

(function($) {
	'use strict';

	var CLD = {};
	
	CLD.Helpers = {
		isMobile: function() {
		    return navigator.userAgent.match(/Android/i) ||
		       	navigator.userAgent.match(/BlackBerry/i) ||
		       	navigator.userAgent.match(/iPhone|iPad|iPod/i) ||
		       	navigator.userAgent.match(/Opera Mini/i) ||
		       	navigator.userAgent.match(/IEMobile/i)
		}
	};

	CLD.userHandle = {
		Init: function() {
			this.userIdGen();
		},
		userIdGen: function() {
			// generate unique user ID on form submit
			// and save it to local storage
			userID = Math.floor((1 + Math.random()) * 0x10000)
			.toString(10)
			.substring(1);
			this.saveLocalStorage(userID);
			return userID;
		},
		saveLocalStorage: function(userID) {
			if (typeof(Storage) !== "undefined" && !localStorage.getItem('userID')) {
				localStorage.setItem("userID", userID);
			}
		},
		applicationNumber: function(applNumber) {
			// generate unique application number on form submit
			// and save it to local storage
			applNumber = Math.floor((1 + Math.random()) * 0x100000)
			.toString(10)
			.substring(1);
			if (typeof(Storage) !== "undefined" && !localStorage.getItem('applicationNumber')) {
				localStorage.setItem("applicationNumber", applNumber);
			}

			return applNumber;
		}
	};

	CLD.RenderHtml = {
		Init: function() {
			// here include html conditionaly
			// if has userID or no
			if (!localStorage.getItem('userID')) {
				this.loadAddBtn();
			} else {
				CLD.RenderHtml.renderResponse();
			}
		},
		loadAddBtn: function() {
			// add account button +
			// if form was saved will load restore form button
			$('#container').load('./templates/home.html', function() {
				$('body').addClass('homepage');
				$('#createAccBtn').slideDown(300);
				$('#createAccBtn').click(function(e) {
					e.preventDefault();
					CLD.RenderHtml.loadTerms();
				})

				if (sessionStorage.getItem('formdata')) {
					$('#restoreForm').slideDown(300);
					$('#restoreFormBtn').slideDown(300);
					CLD.StoreFormData.restoreFormBtn();
				}
			})
		},
		loadTerms: function() {
			// terms & conditions loader
			$('#container').load('./templates/terms.html', function() {
				$('#modalTC').slideDown(300);
				CLD.RenderHtml.termsBehavior();
			});
		},
		termsBehavior: function() {
			// accept button handler + cancel button handler
			var cancelBtn = $('#canselBtn'),
				acceptBtn = $('#acceptBtn');

			cancelBtn.click(function(e) {
				e.preventDefault();
				$('#modalTC').slideUp(300);
				CLD.RenderHtml.loadAddBtn();
			})

			acceptBtn.click(function(e) {
				e.preventDefault();
				sessionStorage.removeItem('formdata');
				CLD.RenderHtml.formContentInit();
			})
		},
		formContentInit: function() {
			// load form content only if terms accepted
			$('body').addClass('form-account');
			$('#container').load('./templates/form.html', function() {
				var nextBtn = $('#navForm .next'),
					prevBtn = $('#navForm .prev'),
					submitBtn = $('#submitBtn'),
					currId;

				$('#ss1').addClass('active');
				prevBtn.hide();

				CLD.RenderHtml.navBtn();
				CLD.StoreFormData.Init();

				currId = $('.section-swipe.active').attr('id');
				CLD.RenderHtml.userMap(currId);
				CLD.RenderHtml.nextBtnClick(nextBtn, submitBtn, currId);
				CLD.RenderHtml.prevBtnClick(prevBtn, submitBtn, currId);
				CLD.FormActions.submitHandle();

				$('#' + currId + ' input')[0].focus();
			});
		},
		nextBtnClick: function(nextBtn, submitBtn, currId) {
			// next button handler
			nextBtn.click(function(e) {
				e.preventDefault();

				var formActive = $('.section-swipe.active').attr('id');

				if (!!CLD.FormActions.validation(formActive)) {
					if ($('#ss3').hasClass('active')) {
						nextBtn.hide();
						submitBtn.show();
					} else {
						$('#navForm a').show();
					}

					if ($('.section-swipe.active').next('.section-swipe').length) {
						$('.section-swipe.active').removeClass('active').animate({
							left: '-100%'
						}, 200, function() {
							$(this).next('.section-swipe').addClass('active');
							currId = $('.section-swipe.active').attr('id');
							CLD.RenderHtml.userMap(currId);
							CLD.RenderHtml.navBtn();

							// enable upload inputs
							if (currId == 'ss4') {
								CLD.FormActions.uploadInputsHandle(currId);
							}
							
							// scroll section next animation
							$('.section-swipe').each( function() {
						        if ($(this).offset().left < 0) {
						            $(this).css("left", "150%");
						        }
						    });

							if (CLD.Helpers.isMobile()) {
								$('#'+currId).animate({
							        left: '0%'
							    }, 200);
							} else {
								$('#'+currId).animate({
							        left: '50%'
							    }, 200);
							}
						    
						 
						    if ($('#'+currId).next().length > 0) {
						        $('#'+currId).next().animate({
						            left: '150%'
						        }, 200);
						    } else {
						        $('#'+currId).prevAll().last().animate({
						            left: '150%'
						        }, 200);
						    }
						})
					}
				}
			});
		},
		prevBtnClick: function(prevBtn, submitBtn, currId) {
			// previous button handler
			prevBtn.click(function(e) {
				e.preventDefault();

				var formActive = $('.section-swipe.active').attr('id');

				if (!!CLD.FormActions.validation(formActive)) {

					if ($('#ss2').hasClass('active')) {
						prevBtn.hide();
					} else {
						$('#navForm a').show();
						submitBtn.hide();
					}

					if ($('.section-swipe.active').prev('.section-swipe').length) {
						$('.section-swipe.active').removeClass('active').animate({
							left: '-150%'
						}, 200, function() {
							$(this).prev('.section-swipe').addClass('active').fadeIn(0);
							currId = $('.section-swipe.active').attr('id');
							CLD.RenderHtml.userMap(currId);
							CLD.RenderHtml.navBtn();

							// scroll section previous animation
							$('.section-swipe').each( function() {
						        if ($(this).offset().left < 0) {
						            $(this).css("left", "150%");
						        }
						    });

							if (CLD.Helpers.isMobile()) {
								$('#'+currId).animate({
							        left: '0%'
							    }, 200);
							} else {
								$('#'+currId).animate({
							        left: '50%'
							    }, 200);
							}
						    
						 
						    if ($('#'+currId).next().length > 0) {
						        $('#'+currId).next().animate({
						            left: '150%'
						        }, 200);
						    } else {
						        $('#'+currId).prevAll().last().animate({
						            left: '150%'
						        }, 200);
						    }
						});
					}
				}
			})
		},
		userMap: function(currId) {
			// form steps mapping
			$('.application-map span').removeClass('active');
			if ($('.application-map span').hasClass(currId)) {
				$('.application-map span.'+currId).addClass('active');
			}

			$('.application-map span').click(function() {
				$(this).attr('class')
			})
		},
		navBtn: function() {
			// 'next', 'prev' buttons positioning
			var navPosition = $('.section-swipe.active').height() + 30;
			$('#navForm').css('top', navPosition);

			// submit button position
			$('#submitBtn').css('top', navPosition + $('#navForm').height() + 30);
		},
		renderResponse: function() {
			$('#container').load('./templates/submit-success.html', function() {
				$('header h1').html('Your form has been submitted!');

				var formResponse = $('#formResponse');
				formResponse.show(100);
				formResponse.find('#submitSuccess').slideDown(200);
				formResponse.find('#userInfo').html(userID);
			});
		},
		renderResponseFailed: function() {
			$('#container').load('./templates/submit-success.html', function() {
				$('header h1').html('Your form has been submitted!');

				var formResponse = $('#formResponse');
				formResponse.show(100);
				formResponse.find('#submitFailure').slideDown(200);
				formResponse.find('#applInfo').html(localStorage.getItem('applicationNumber'));
			});
		}
	};

	CLD.FormActions = {
		validation: function(formActive) {
			// jquery-validation plugin for form validation
			// will be called on 'next', 'prev' click
			var validator = $('#accountForm').validate({
				ignore: 'input[type="button"],input[type="submit"]'
			});
			var valid = true;

			$('#accountForm #'+ formActive +' input').each(function(i, item) {
				valid = validator.element(item) && valid;
			});

		    if(!valid){
		        return false;
		    } else {
		    	return true;
		    }
		},
		submitHandle: function() {
			// form submit handler
			// ajax to action.php to save data
			// to users.json
			$('#accountForm').submit(function(e) {
				e.preventDefault(e);

				var data = {
					'action': 'formPost',
					'userId': '0'
				}
				var formArray = $(this);
				data = $(this).serialize() + '&' + $.param(data);

				$.ajax({
					type: 'POST',
					dataType: 'json',
					url: './action.php',
					data: data,
					beforeSend: function(xhr, s) {
						CLD.userHandle.Init();
						s.data += "&userId="+userID;
					},
					success: function(data) {
						CLD.RenderHtml.renderResponse();
					},
					error: function(data) {
						CLD.userHandle.applicationNumber();
						localStorage.removeItem('userID');
						CLD.RenderHtml.renderResponseFailed();
					}
				})

				return false;
			})
		},
		uploadInputsHandle: function(currId) {
			var labelThis;
			$('#'+currId+' .elements').on('click', 'label', function(e) {
				e.preventDefault();

				labelThis = $(this).attr('for');
				$('#'+labelThis).trigger('click');
				CLD.FormActions.passValue(labelThis);
			});
		},
		passValue: function(labelThis) {
			$('#'+labelThis).on('change', function(e) {
				e.preventDefault();

				var inputVal = $('#' + labelThis).val().replace(/C:\\fakepath\\/i, '');
				$('#'+labelThis+'Name').val(inputVal);
			});
		}
	};

	CLD.StoreFormData = {
		Init: function() {
			this.saveFormBtn();
		},
		saveFormBtn: function() {
			// save handler
			$('#saveForm').click(function() {
				sessionStorage.setItem("formdata", CLD.StoreFormData.saveForm("#accountForm"));
				location.reload();
			})
		},
		restoreFormBtn: function() {
			// restore handler
			$('#restoreFormBtn').click(function(e) {
				e.preventDefault();

				CLD.RenderHtml.formContentInit();

				setTimeout(function() {
					var formString = sessionStorage.getItem("formdata");
					CLD.StoreFormData.restoreForm(formString, $("#accountForm"));
				}, 100)
			});
		},
		saveForm: function(filledForm) {
			// saver for entered form data
		    var formObject = {};
		    $(filledForm).find("input, select, textarea").each(function() {
		        if (this.name) {
		            var elem = $(this);
		            if (elem.attr("type") == 'checkbox' || elem.attr("type") == 'radio') {
		                formObject[this.name] = elem.attr("checked");
		            } else {
		                formObject[this.name] = elem.val();
		            }
		        }
		    });
		    var formString = JSON.stringify(formObject);
		    return formString;
		},
		restoreForm: function(formString, unfilledForm) {
			// restore and fill up saved form data
		    var formObject = JSON.parse(formString);
		    $(unfilledForm).find("input, select").each(function() {
		        if (this.name) {
		            var inputName = this.name,
		            	elem = $(this); 
		            elem.val(formObject[inputName]);
		        }
			});
		}
	};

	CLD.Homepage = {
		Init: function() {
			this.behavior();
		},
		behavior: function() {
			// set height of container
			var headHeight = $('header').height(),
				footHeight = $('footer').height();

			$('#container').height($(window).height() - headHeight - footHeight);
			$(window).resize(function() {
				$('#container').height($(window).height() - headHeight - footHeight);
			})
		}
	};

	CLD.Init = (function() {
		CLD.RenderHtml.Init();
		CLD.Homepage.Init();
	})();

	App = CLD;
})(jQuery);