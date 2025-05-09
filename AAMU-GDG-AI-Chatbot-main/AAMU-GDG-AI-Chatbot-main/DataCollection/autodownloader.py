
import requests


range = ["2024-2025","2023-2024","2022-2023","2021-2022","2020-2021","2019-2020","2018-2019","2017-2018","2016-2017","2015-2016","2014-2015","2013-2014","2012-2013","2011-2012","2008-2011","2006-2008","2003-2005","2000-2002"]

for year in range:
    url = f"https://www.aamu.edu/academics/catalogs/_documents/undergraduate-bulletins/undergraduate-bulletin-{year}.pdf"
    response = requests.get(url)
    with open(f"Pdfstore/Bulletin-{year}.pdf", "wb") as f:
        f.write(response.content)
print("✅ All downloads attempted.")
