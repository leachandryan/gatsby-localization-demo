import type { GatsbyConfig } from "gatsby"

const config: GatsbyConfig = {
  siteMetadata: {
    title: `gatsby-localization`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  // Disable GraphQL TypeGen to fix the ImageSharp errors
  graphqlTypegen: false,
  plugins: [
    // Image processing plugins for Gatsby 5
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    
    // File system source (if you need to process local files/images)
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    
    // Manifest for PWA support (optional)
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Gatsby Localization Demo`,
        short_name: `Localization`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // Create this or remove this line
      },
    },
  ],
}

export default config