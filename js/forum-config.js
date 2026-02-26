(() => {
  window.BEHOP_FORUM_CONFIG = Object.assign(
    {
      // Pending moderation endpoint.
      // Can be a custom backend endpoint or Supabase REST URL such as:
      // https://<project-ref>.supabase.co/rest/v1/comments
      commentSubmitUrl: "https://whpuxyicllyaopnlxakn.supabase.co/rest/v1/comments",
      // Topic publish endpoint (custom backend or Supabase REST URL).
      // Example: https://<project-ref>.supabase.co/rest/v1/forum_topics
      topicSubmitUrl: "https://whpuxyicllyaopnlxakn.supabase.co/rest/v1/forum_topics",
      // Pending analytics endpoint.
      // Can be a custom backend endpoint or Supabase REST URL.
      eventSubmitUrl: "",
      // Required when using Supabase REST endpoints from the browser.
      supabasePublishableKey: "sb_publishable_L-jiLQCjXsei_8VNVnORXA_iclYuYJQ",
      requestTimeoutMs: 8000,
      approvedCommentsPath: "/assets/data/forum-comments-approved.json",
      approvedTopicsPath: "/assets/data/forum-topics-approved.json",
      approvedMetricsPath: "/assets/data/forum-metrics-approved.json",
      topicDefaultCategory: "message",
      topicDefaultTag: "message",
      topicInitialStatus: "pending",
    },
    window.BEHOP_FORUM_CONFIG || {}
  )
})()
