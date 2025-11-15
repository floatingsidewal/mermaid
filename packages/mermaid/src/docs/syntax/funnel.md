# Funnel Chart Diagrams (v<MERMAID_RELEASE_VERSION>+)

> A funnel chart is a specialized chart type designed to show how data decreases progressively through sequential stages. Funnel charts are commonly used to visualize conversion rates in sales pipelines, marketing campaigns, recruitment processes, and other multi-stage workflows where there's a natural reduction from one step to the next.

Mermaid can render Funnel Chart diagrams.

```mermaid-example
funnel title Sales Pipeline
    "Leads" : 1000
    "Qualified" : 500
    "Proposal" : 200
    "Negotiation" : 100
    "Closed" : 50
```

## Syntax

Drawing a funnel chart is simple in Mermaid:

- Start with the `funnel` keyword to begin the diagram
  - `showData` to render the actual data values alongside labels. This is **_OPTIONAL_**
- Followed by `title` keyword and its value in string to give a title to the funnel chart. This is **_OPTIONAL_**
- Followed by the dataset, representing stages in the funnel. Stages are rendered in the order they appear.
  - `label` for a stage in the funnel diagram within `" "` quotes
  - Followed by `:` colon as separator
  - Followed by `positive numeric value` (supported up to two decimal places)
  - Optionally followed by stage metadata on separate lines:
    - `desc "description text"` - Add descriptive notes (can have multiple lines)
    - `[color: "colorValue"]` - Specify custom color for the stage
    - `[number: "customValue"]` - Override auto-generated stage number

**Note:**

> Funnel chart values must be **positive numbers greater than or equal to zero**.
> **Negative values are not allowed** and will result in an error.
> While values don't have to decrease, funnel charts are typically used to show decreasing progression.

**Syntax:**

```
funnel [showData] (OPTIONAL)
[title] [titlevalue] (OPTIONAL)
"[stage1]" : [value1]
[desc "[description line 1]"] (OPTIONAL)
[desc "[description line 2]"] (OPTIONAL)
[[color: "[colorValue]"]] (OPTIONAL)
[[number: "[customNumber]"]] (OPTIONAL)
"[stage2]" : [value2]
"[stage3]" : [value3]
.
.
```

## Examples

### Basic Funnel Chart

```mermaid-example
funnel title Marketing Funnel
    "Website Visits" : 10000
    "Sign-ups" : 1000
    "Active Users" : 500
    "Paying Customers" : 100
```

### Funnel with Data Values Displayed

Use the `showData` keyword to display the actual values on the chart:

```mermaid-example
funnel showData
    title User Acquisition Funnel
    "Impressions" : 100000
    "Clicks" : 10000
    "Registrations" : 1000
    "Activations" : 500
    "Retained" : 250
```

### Recruitment Funnel

```mermaid-example
funnel title Hiring Process
    "Applications" : 500
    "Phone Screens" : 100
    "Technical Interviews" : 50
    "On-site Interviews" : 25
    "Offers" : 10
    "Acceptances" : 8
```

### E-commerce Conversion Funnel

```mermaid-example
funnel showData
    title E-commerce Conversion
    "Product Views" : 50000
    "Add to Cart" : 5000
    "Checkout Started" : 2000
    "Payment Completed" : 1500
```

### Funnel with Custom Colors (v<MERMAID_RELEASE_VERSION>+)

You can customize the color of each stage using the `[color: "value"]` syntax:

```mermaid-example
funnel title Marketing Campaign
    "Awareness" : 10000
    [color: "#FF6B6B"]
    "Interest" : 5000
    [color: "#4ECDC4"]
    "Consideration" : 2000
    [color: "#45B7D1"]
    "Conversion" : 500
    [color: "#96CEB4"]
```

### Funnel with Stage Notes (v<MERMAID_RELEASE_VERSION>+)

Add descriptive notes to stages using the `desc` keyword. Notes are displayed alternately on the left and right sides:

```mermaid-example
funnel title Customer Journey
    "Awareness" : 5000
    desc "Customer discovers the brand"
    desc "Through marketing channels"
    "Interest" : 2000
    desc "Customer shows interest"
    desc "Engages with content"
    "Decision" : 500
    desc "Customer makes purchase"
```

### Funnel with Custom Stage Numbers (v<MERMAID_RELEASE_VERSION>+)

Override the auto-generated sequential numbering with custom values:

```mermaid-example
funnel title Product Development
    "Planning" : 100
    [number: "A1"]
    "Design" : 80
    [number: "B2"]
    "Development" : 60
    [number: "C3"]
    "Testing" : 40
    [number: "D4"]
    "Launch" : 20
    [number: "E5"]
```

### Complete Funnel with All Features (v<MERMAID_RELEASE_VERSION>+)

Combine colors, notes, and custom numbers in a single funnel:

```mermaid-example
funnel showData
    title Complete Sales Funnel
    "Lead Generation" : 1000
    desc "Marketing campaigns drive traffic"
    desc "Multiple channels: SEO, Ads, Social"
    [color: "#FF6B6B"]
    [number: "01"]
    "Lead Qualification" : 500
    desc "Sales team reviews leads"
    [color: "#4ECDC4"]
    [number: "02"]
    "Proposal" : 200
    desc "Custom solutions presented"
    [color: "#45B7D1"]
    [number: "03"]
    "Closed Won" : 100
    desc "Contract signed"
    [color: "#96CEB4"]
    [number: "04"]
```

### Funnel with Accessibility Features

```mermaid-example
---
config:
  funnel:
    funnelWidth: 600
    funnelHeight: 700
---
funnel showData
    title Sales Conversion Funnel
    accTitle: Q1 2024 Sales Performance
    accDescr: This funnel chart shows the sales conversion rates through each stage of our Q1 sales process
    "Leads" : 5000
    "Qualified Leads" : 2500
    "Proposals Sent" : 1000
    "Negotiations" : 500
    "Closed Deals" : 200
```

## Configuration

Possible funnel diagram configuration parameters:

| Parameter            | Description                                                   | Default value   |
| -------------------- | ------------------------------------------------------------- | --------------- |
| `funnelWidth`        | The width of the funnel diagram.                              | `500`           |
| `funnelHeight`       | The height of the funnel diagram.                             | `600`           |
| `useMaxWidth`        | When true, uses available width.                              | `true`          |
| `autoNumbering`      | Automatically number stages sequentially (01, 02, 03...).     | `true`          |
| `notePosition`       | Position of stage notes/descriptions (alternating/left/right) | `"alternating"` |
| `showNoteConnectors` | Show connector lines from notes to stages.                    | `true`          |
| `noteMaxWidth`       | Maximum width of note containers in pixels.                   | `200`           |

## Use Cases

Funnel charts are ideal for visualizing:

- **Sales Pipelines**: Track prospects from initial contact to closed deals
- **Marketing Conversion Funnels**: Measure effectiveness of marketing campaigns
- **User Onboarding**: Monitor user activation and retention
- **Recruitment Processes**: Visualize candidate progression through hiring stages
- **Customer Journey**: Show how customers move through awareness, consideration, and purchase stages
- **Application Processes**: Track completion rates for multi-step forms or applications

## Styling

The funnel chart automatically uses the theme colors defined in your Mermaid configuration. Each stage is assigned a different color from the theme's color palette (up to 12 distinct colors).

### Custom Colors (v<MERMAID_RELEASE_VERSION>+)

You can override the default theme colors for individual stages using the `[color: "value"]` syntax. Colors can be specified using:

- Hex colors: `#FF6B6B`
- RGB: `rgb(255, 107, 107)`
- Named colors: `red`, `blue`, etc.

### Stage Numbers (v<MERMAID_RELEASE_VERSION>+)

By default, stages are automatically numbered sequentially (01, 02, 03...). You can:

- Disable auto-numbering in configuration: `autoNumbering: false`
- Override specific stage numbers: `[number: "A1"]`
- Mix auto-generated and custom numbers

### Stage Notes (v<MERMAID_RELEASE_VERSION>+)

Stage notes appear in rounded rectangles with connector lines to their respective stages. By default:

- Notes alternate between left and right sides
- Each note includes a "Step N" header
- Multiple description lines are supported
- Note positioning can be configured (`alternating`, `left`, or `right`)

## Best Practices

1. **Order Matters**: List stages in the logical order they occur in your process
2. **Consistent Units**: Ensure all values use the same unit of measurement
3. **Clear Labels**: Use descriptive, concise labels for each stage
4. **Appropriate Scale**: Choose values that clearly show the progression/reduction
5. **Realistic Data**: While values don't have to decrease, funnel charts work best when they do

## Accessibility

Funnel charts support accessibility features:

- `accTitle`: Set an accessible title for screen readers
- `accDescr`: Provide a detailed description of the chart

Example:

```
funnel title Sales Funnel
    accTitle: Q1 2024 Sales Pipeline
    accDescr: This funnel shows the conversion rate from leads to customers in Q1
    "Leads" : 1000
    "Customers" : 100
```
