<template>
  <b-row>
    <b-colxx xxs="12">
      <h5 class="mb-4 card-title">{{ $t("cards.tab-card") }}</h5>
      <b-row>
        <b-colxx xxs="12" xs="12" lg="12" class="mb-3">
          <b-card class="mb-4" no-body>
            <b-tabs card no-fade>
              <b-tab
                title="Basis details"
                active
                title-item-class="w-30 text-center"
              >
                <label class="form-group has-float-label">
                  <input
                    type="text"
                    v-model="pageData.locales.en.name"
                    class="form-control"
                  />
                  <span>{{ $t("forms.name") }}</span>
                </label>
                <quill-editor
                  ref="myTextEditor"
                  v-model="pageData.locales.en.description"
                  :options="editorOption"
                  @blur="onEditorBlur($event)"
                  @focus="onEditorFocus($event)"
                  @ready="onEditorReady($event)"
                >
                </quill-editor>
              </b-tab>
              <b-tab
                @click="attach()"
                title="Attachment"
                title-item-class="w-30 text-center"
              >
                <h5 class="mb-4 card-title">
                  Homemade Cheesecake with Fresh Berries and Mint
                </h5>
                <b-button size="sm" variant="outline-primary">Edit</b-button>
              </b-tab>
              <b-tab
                @click="meta()"
                title="Meta Date"
                title-item-class="w-30 text-center"
              >
                <h5 class="mb-4 card-title">
                  Wedding Cake with Flowers Macarons and Blueberries
                </h5>
                <b-button size="sm" variant="outline-primary">Edit</b-button>
              </b-tab>
            </b-tabs>
          </b-card>
        </b-colxx>
        <b-colxx
          xxs="12"
          style="display: flex;align-items: center;justify-content: center;"
        >
          <!-- <h3>{{ items.length }}</h3> -->
          <b-button @click="save()" class="mb-2" size="lg" variant="primary"
            >{{ $t("button.save") }} {{ $t("button.changes") }}</b-button
          >
        </b-colxx>
      </b-row>
    </b-colxx>
  </b-row>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    "quill-editor": quillEditor
  },
  data() {
    return {
      pageId: null,
      pageData: null,
      // quillEditor
      content: "",
      editorOption: {
        placeholder: "",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
              { list: "ordered" },
              { list: "bullet" },
              { indent: "-1" },
              { indent: "+1" }
            ],
            ["link", "image"],
            ["clean"]
          ]
        }
      },
      contentBubble: "",
      editorOptionBubble: {
        theme: "bubble",
        placeholder: "",
        modules: {
          toolbar: [
            [
              "bold",
              "italic",
              "link",
              { header: 1 },
              { header: 2 },
              "blockquote"
            ]
          ]
        }
      }
      // quillEditor
    };
  },
  created() {
    this.pageId = this.$route.query.id;
    this.getPage({ id: this.pageId });

    console.log("hi from here", this.pageId);
  },
  methods: {
    ...mapActions(["getPage", "updatePageData"]),
    save() {
      console.log(this.pageData);
    },
    onEditorBlur(editor) {
      console.log("editor blur!", editor);
      console.log(this.pageData);
    },
    onEditorFocus(editor) {
      console.log("editor focus!", editor);
    },
    onEditorReady(editor) {
      console.log("editor ready!", editor);
    },
    onEditorChange({ editor, html, text }) {
      // console.log('editor change!', editor, html, text)
      this.contentBubble = html;
    }
  },
  computed: {
    ...mapGetters(["page"]),
    editor() {
      return this.$refs.myTextEditor.quill;
    }
  },
  watch: {
    page(newpage, oldone) {
      this.pageData = newpage;
      console.log(this.pageData);
    }
  }
};
</script>
