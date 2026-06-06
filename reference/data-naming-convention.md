# Data naming convention

MapAction data naming convention (DNC) — syntax, clauses, and permissions used for layer names in the Syria IHDP GeoPackage.

The **MapAction data naming convention (DNC)** is the system used for naming all data that MapAction receives.

Layer names in this documentation (for example `syr_admn_ad0_ln_s1_uncs_pp`) follow this convention.


## Syntax

```
geoextent_category_theme_geometry_scale_source_permission[_FreeText]
```

Square brackets denote optional clauses.

### Example (Syria admin boundary line)

```
syr_admn_ad0_ln_s1_uncs_pp
 │    │    │   │  │   │    └─ permission: public data, public maps
 │    │    │   │  │   └────── source: UN Cartographic Section
 │    │    │   │  └────────── scale: s1
 │    │    │   └───────────── geometry: line (ln)
 │    │    └───────────────── theme: admin level 0 (ad0)
 │    └────────────────────── category: administration (admn)
 └─────────────────────────── geoextent: Syria (syr)
```

## Regular expression

The definitive regex is in the `pattern` section of the MapAction lookup file:

data_naming_convention.json
```JSON
{
    "pattern": "^(?P<geoext>.+?)_(?P<datacat>.+?)_(?P<datatheme>.+?)_(?P<geom>.+?)_(?P<scale>.+?)_(?P<source>.+?)_(?P<perm>.+?(?=(_|\\()|\\.))(_(?P<freetext>.+(?=\\.)))?",
    "clauses":[
        {
            "name":"geoext",
            "validator":"mapactionpy_controller.name_clause_validators.NamingLookupClause",
            "filename":"01_geoextent.csv",
            "lookup_field":"Value"
        },
        {
            "name": "datacat",
            "validator": "mapactionpy_controller.name_clause_validators.NamingLookupClause",
            "filename": "02_category.csv",
            "lookup_field": "Value"
        },
        {
            "name": "datatheme",
            "validator": "mapactionpy_controller.name_clause_validators.NamingLookupClause",
            "filename": "03_theme.csv",
            "lookup_field": "Value"
        },
        {
            "name": "geom",
            "validator": "mapactionpy_controller.name_clause_validators.NamingLookupClause",
            "filename": "04_geometry.csv",
            "lookup_field": "Value"
        },
        {
            "name": "scale",
            "validator": "mapactionpy_controller.name_clause_validators.NamingLookupClause",
            "filename": "05_scale.csv",
            "lookup_field": "Value"
        },
        {
            "name": "source",
            "validator": "mapactionpy_controller.name_clause_validators.NamingLookupClause",
            "filename": "06_source.csv",
            "lookup_field": "Value"
        },
        {
            "name": "perm",
            "validator": "mapactionpy_controller.name_clause_validators.NamingLookupClause",
            "filename": "07_permission.csv",
            "lookup_field": "Value"
        },
        {
            "name": "freetext",
            "validator": "mapactionpy_controller.name_clause_validators.NamingFreeTextClause",
            "alias": "Value"
        }
    ]
}
```

**Python pattern:**

```python
^(?P<geoext>.*?)_(?P<datacat>.*?)_(?P<datatheme>.*?)_(?P<geom>.*?)_(?P<scale>.*?)_(?P<source>.*?)_(?P<perm>[phmPHM][phmPHM])(_(?P<freetext>.+))?
```

## Clause reference

| Clause | Default format | Notes |
| --- | --- | --- |
| **geoextent** | Typically three characters | Spatial or geographical extent: country, continent, admin district, city, etc. Use agreed country codes (ISO-style, e.g. `syr` for Syria) or combined codes (e.g. `htidom` for Haiti and Dominican Republic). The master list includes ISO country codes, continent codes, and `wrl` for global layers. |
| **category** | Typically four characters | Broad description of data content. Introduced because geodatabases lack directory structure; equivalent to a folder category (e.g. `admn`, `bldg`, `elev`). |
| **theme** | Typically three characters | More detailed content description. Valid themes are nested under categories. The master list is maintained in the crash-move lookup and should be reviewed as the deployment GDB is populated. |
| **geometry** | Two or three characters | Geometry type of the spatial component: point (`pt`), line (`ln`), polygon (`py`), raster (`ras`), raster catalog (`rca`), table (`tab`), TIN (`tin`). |
| **scale** | `s` + one digit | Order of magnitude for **display** scale (not survey scale or resolution). Distinguishes datasets useful at different map scales. If omitted, scale is unknown and the layer is shown at all scale ranges. |
| **source** | GDB-safe characters | Origin of the dataset. Should match what you would cite on a map margin—not a data portal. May be an organisation or a specific dataset name. |
| **permission** | Two letters, no separator | Redistribution and derived-map permissions: `[data audience][map audience]`. See table below. |
| **[FreeText]** | Optional; GDB-safe characters | **Required** when needed for admin-unit labels (e.g. `COD_pp` for COD-style admin naming). **Optional** for field sub-conventions, raster variants, or temporary/working copies. |

## Permission codes

Format: two letters with **no** underscore between them — `[who can receive data][who can receive derived maps]`.

Map permissions are always at least as open as data permissions.

| Distribution group | Character |
| --- | --- |
| Public | `p` |
| Humanitarian community | `h` |
| MapAction only | `m` |

**Examples:**

| Code | Meaning |
| --- | --- |
| `pp` | Public data and public maps |
| `hh` | Humanitarian community for data and maps |
| `mm` | MapAction internal use only |

## Free text clause

**Required uses:** Tags that identify admin units (e.g. which admin level 1/2 labels mean in a given country—region, province, district, commune). Often found in HDX metadata or reference sources.

**Optional uses:**

- Field-specific sub-naming when needed
- Distinguishing raster variants that would otherwise share the same base name
- Intermediate or working copies during GIS processing

---

*Source: MapAction Data Naming Convention (Confluence export).*