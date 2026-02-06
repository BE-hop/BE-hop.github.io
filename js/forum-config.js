(() => {
  window.BEHOP_FORUM_CONFIG = Object.assign(
    {
      // Pending moderation endpoint.
      // Can be a custom backend endpoint or Supabase REST URL such as:
      // https://<project-ref>.supabase.co/rest/v1/comments
      commentSubmitUrl: "https://whpuxyicllyaopnlxakn.supabase.co/rest/v1/comments",
      // Pending analytics endpoint.
      // Can be a custom backend endpoint or Supabase REST URL.
      eventSubmitUrl: "",
      // Required when using Supabase REST endpoints from the browser.
      supabasePublishableKey: "sb_publishable_L-jiLQCjXsei_8VNVnORXA_iclYuYJQ",
      requestTimeoutMs: 8000,
      approvedCommentsPath: "/assets/data/forum-comments-approved.json",
      approvedMetricsPath: "/assets/data/forum-metrics-approved.json",
    },
    window.BEHOP_FORUM_CONFIG || {}
  )
})()
