const SearchInput = {
  data() {
    return {
      input: "",
    };
  },
  emits: ["input-change"],
  template: `
    <div className="input-group-text">
      <label className="form-label visually-hidden" for="searchInput">Search GitHub</label>
      <input className="form-control" type="text" id="searchInput" v-model="input" @input="$emit('input-change', input)" placeholder="Enter a GitHub username to search...">
    </div>
  `,
};

const UserProfile = {
  props: ["profileData"],
  template: `
    <div className="my-3 border border-dark row p-3 gx-3 justify-content-between">
      <div className="col-md-4 text-center text-md-start">
        <img className="img-fluid rounded" :src="profileData.avatar_url" alt=""/>
        <ul className="list-group-flush mt-2 p-0">
          <li className="list-group-item">{{ profileData.name ? profileData.name : profileData.login }}</li>
          <li className="list-group-item" v-if="profileData.bio">{{ profileData.bio }}</li>
          <li className="list-group-item" v-if="profileData.blog">{{ profileData.blog }}</li>
          <li className="list-group-item" v-if="profileData.location">{{ profileData.location }}</li>
        </ul>
        <div className="mb-2">
          <span className="badge bg-primary me-1">Followers: {{ profileData.followers}}</span>
          <span className="badge bg-warning">Following: {{ profileData.following}}</span>
        </div>
        <a className="btn btn-primary mb-1" :href="profileData.html_url" target="_blank">View Profile</a>
      </div>

      <div className="col-md-8">
        
        <slot className="mt-3"></slot>
      </div>
    </div>
    `,
};

const UserRepos = {
  props: ["reposData"],
  template: `
    <div>
    <h3>Latest Repos</h3>
    <ul className="list-group">
      <li className="list-group-item" v-for="repo in reposData" :key="repo.id">
        <a :href="repo.html_url" target="_blank">{{ repo.name }}</a>
        <p v-if="repo.description">Description: {{ repo.description }}</p>
        <p>Language: {{ repo.language }}</p>
      </li>
    </ul>
    </div>
  `,
};

const app = Vue.createApp({
  data() {
    return {
      user: "",
      repos: [],
      error: "",
    };
  },
  components: {
    SearchInput,
    UserProfile,
    UserRepos,
  },
  methods: {
    async fetchUserProfile(searchInput) {
      const profileResponse = await fetch(
        `http://api.github.com/users/${searchInput}`
      );
      const profileData = await profileResponse.json();

      if (profileData.message) {
        this.displayAlert(profileData.message);
      } else {
        this.user = profileData;
        const reposResponse = await fetch(
          `http://api.github.com/users/${searchInput}/repos?per_page=5&sort=created`
        );
        const reposData = await reposResponse.json();
        this.repos = reposData;
      }
    },
    displayAlert(message) {
      this.error = `Error: ${message}`;
      setTimeout(() => {
        this.error = "";
      }, 2000);
    },
  },
});

app.mount("#app");
