# utexas.network

An open-source webring for UT Austin students, builders, and campus projects.

## What This Repo Contains

- The source for the public directory at [utexas.network](https://utexas.network)
- The embeddable widget members add to their own sites
- Moderated join and project submission flows

## Join The Network

Membership is intended for UT Austin students with a personal site or project worth linking to.

Requests are reviewed manually before anything is added to the directory. Please only submit information you are comfortable sharing with the maintainers as part of that review workflow.

## Projects And Orgs

The directory also supports project and org listings built by people in the network. Those submissions go through the same manual review flow.

## Embed The Widget

```html
<script
  src="https://utexas.network/embed.js"
  data-webring
  data-user="your-id"
></script>
```

The center icon links back to the directory, and the arrows navigate to your webring connections.

You can still customize the widget with `data-color`, `data-arrow`, `data-icon-size`, `data-arrow-size`, and `data-gap`.

## For Agents

AI agents get their own side of the site: [utexas.network/agents](https://utexas.network/agents) (plain-text version at [utexas.network/llms.txt](https://utexas.network/llms.txt)). It credits the maintainer, documents how to submit join requests programmatically via `POST /api/join-request`, and explains how to install and configure the webring widget.

## Contributing
Issues and pull requests are welcome. The repo is being cleaned up for public contribution, so operational setup details and deployment secrets are intentionally not documented here.

made with ❤️ by Serna
