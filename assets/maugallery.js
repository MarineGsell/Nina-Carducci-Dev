(function($) {
  $.fn.mauGallery = function(options) {
    var options = $.extend($.fn.mauGallery.defaults, options);
    var tagsCollection = [];
    return this.each(function() {
      $.fn.mauGallery.methods.createRowWrapper($(this));
      if (options.lightBox) {
        $.fn.mauGallery.methods.createLightBox(
          $(this),
          options.lightboxId,
          options.navigation
        );
      }
      $.fn.mauGallery.listeners(options);

      $(this)
        .children(".gallery-item")
        .each(function(index) {
          $.fn.mauGallery.methods.responsiveImageItem($(this));
          $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
          $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns);
          var theTag = $(this).data("gallery-tag");
          if (
            options.showTags &&
            theTag !== undefined &&
            tagsCollection.indexOf(theTag) === -1
          ) {
            tagsCollection.push(theTag);
          }
        });

      if (options.showTags) {
        $.fn.mauGallery.methods.showItemTags(
          $(this),
          options.tagsPosition,
          tagsCollection
        );
      }

      $(this).fadeIn(500);
    });
  };
  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true
  };
  $.fn.mauGallery.listeners = function(options) {
    $(".gallery-item").on("click", function() {
      if (options.lightBox && $(this).prop("tagName") === "IMG") {
        $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
      } else {
        return;
      }
    });

    $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);
    // Click sur la flèche précédente
    $(".gallery").on("click", ".mg-prev", () =>
      $.fn.mauGallery.methods.prevImage(options.lightboxId)
    );
    // Click sur la flèche suivante
    $(".gallery").on("click", ".mg-next", () =>
      $.fn.mauGallery.methods.nextImage(options.lightboxId)
    );
  };
  $.fn.mauGallery.methods = {
    createRowWrapper(element) {
      if (
        !element
          .children()
          .first()
          .hasClass("row")
      ) {
        element.append('<div class="gallery-items-row row"></div>');
      }
    },
    wrapItemInColumn(element, columns) {
      if (columns.constructor === Number) {
        element.wrap(
          `<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`
        );
      } else if (columns.constructor === Object) {
        var columnClasses = "";
        if (columns.xs) {
          columnClasses += ` col-${Math.ceil(12 / columns.xs)}`;
        }
        if (columns.sm) {
          columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`;
        }
        if (columns.md) {
          columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`;
        }
        if (columns.lg) {
          columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`;
        }
        if (columns.xl) {
          columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`;
        }
        element.wrap(`<div class='item-column mb-4${columnClasses}'></div>`);
      } else {
        console.error(
          `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
        );
      }
    },
    moveItemInRowWrapper(element) {
      element.appendTo(".gallery-items-row");
    },
    responsiveImageItem(element) {
      if (element.prop("tagName") === "IMG") {
        element.addClass("img-fluid");
      }
    },
    openLightBox(element, lightboxId) {
      $(`#${lightboxId}`)
        .find(".lightboxImage")
        .attr("src", element.attr("src"));
      $(`#${lightboxId}`).modal("toggle");
    },
    prevImage() {
      // Stockage de l'image actuellement affichée dans la modale
      let activeImage = null;
      // Sélection de toutes les images de la galerie
      $("img.gallery-item").each(function() {
        // Si l'image courante à la même source que l'image de la modale
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          activeImage = $(this);
        }
      });
      // Récupération du filtre sélectionné
      let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      // Création du tableau pour stocker les images à parcourir
      let imagesCollection = [];
      // Si le filtre selctionné est "tous"
      if (activeTag === "all") {
        // On parcourt toutes les images
        $(".item-column").each(function() {
          if ($(this).children("img").length) {
            // On les stocke dans le tableau
            imagesCollection.push($(this).children("img"));
          }
        });
      } else {
        // On parcourt toutes les images
        $(".item-column").each(function() {
          // On récupère le filtre actif
          if (
            $(this)
              .children("img")
              .data("gallery-tag") === activeTag
          ) {
            // On stocke les images correspondantes au filtre dans le tableau
            imagesCollection.push($(this).children("img"));
          }
        });
      }
      // Trouver l'index actuel
      let indexImg = imagesCollection.findIndex(img => 
        $(img).attr("src") === $(".lightboxImage").attr("src")
      );
      // Trouver l'index précédent 
      let indexPrev = indexImg > 0 ? indexImg - 1 : imagesCollection.length - 1;
      // L'image de la modale est l'image qui correpond à next
      $(".lightboxImage").attr("src", $(imagesCollection[indexPrev]).attr("src"));
    },
    nextImage() {
      // Stockage de l'image actuellement affichée dans la modale
      let activeImage = null;
      // Sélection de toutes les images de la galerie
      $("img.gallery-item").each(function() {
        // Si l'image courante à la même source que l'image de la modale
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          activeImage = $(this);
        }
      });
      // Récupération du filtre sélectionné
      let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      // Création du tableau pour stocker les images à parcourir
      let imagesCollection = [];
      // Si le filtre selctionné est "tous"
      if (activeTag === "all") {
        // On parcourt toutes les images
        $(".item-column").each(function() {
          if ($(this).children("img").length) {
            // On les stocke dans le tableau
            imagesCollection.push($(this).children("img"));
          }
        });
      } else {
        // On parcourt toutes les images
        $(".item-column").each(function() {
          // On récupère le filtre actif
          if (
            $(this)
              .children("img")
              .data("gallery-tag") === activeTag
          ) {
            // On stocke les images dans le tableau
            imagesCollection.push($(this).children("img"));
          }
        });
      }
      // Trouver l'index actuel
      let indexImg = imagesCollection.findIndex(img => 
        $(img).attr("src") === $(".lightboxImage").attr("src")
      );
      // Trouver l'index précédent 
      let indexNext = indexImg < imagesCollection.length - 1 ? indexImg + 1 : indexImg = 0;
      // L'image de la modale est l'image qui correpond à next
      $(".lightboxImage").attr("src", $(imagesCollection[indexNext]).attr("src"));
    },
    createLightBox(gallery, lightboxId, navigation) {
      gallery.append(`<div class="modal fade" id="${
        lightboxId ? lightboxId : "galleryLightbox"
      }" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            ${
                              navigation
                                ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                                : '<span style="display:none;" />'
                            }
                            <img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clique"/>
                            ${
                              navigation
                                ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>'
                                : '<span style="display:none;" />'
                            }
                        </div>
                    </div>
                </div>
            </div>`);
    },
    showItemTags(gallery, position, tags) {
      var tagItems =
        '<li class="nav-item"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>';
      $.each(tags, function(index, value) {
        tagItems += `<li class="nav-item active">
                <span class="nav-link"  data-images-toggle="${value}">${value}</span></li>`;
      });
      var tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

      if (position === "bottom") {
        gallery.append(tagsRow);
      } else if (position === "top") {
        gallery.prepend(tagsRow);
      } else {
        console.error(`Unknown tags position: ${position}`);
      }
    },
    filterByTag() {
      if ($(this).hasClass("active-tag")) {
        return;
      }
      $(".active-tag").removeClass("active active-tag");
      $(this).addClass("active-tag");

      var tag = $(this).data("images-toggle");

      $(".gallery-item").each(function() {
        $(this)
          .parents(".item-column")
          .hide();
        if (tag === "all") {
          $(this)
            .parents(".item-column")
            .show(300);
        } else if ($(this).data("gallery-tag") === tag) {
          $(this)
            .parents(".item-column")
            .show(300);
        }
      });
    }
  };
})(jQuery);
