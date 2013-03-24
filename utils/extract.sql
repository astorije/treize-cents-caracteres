COPY (
  SELECT communes_simplifiees.nomcom,
         communes_simplifiees.surf,
         communes_simplifiees.insee,
         pop90,
         communes_simplifiees.pop99,
         lon,lat,
         area_gares * 100/communes_simplifiees.area as gares, 
         tx_app
   FROM
         communes_simplifiees,
         type,
         status_occupation
   WHERE
         communes_simplifiees.insee=type.insee
         AND status_occupation.insee = communes_simplifiees.insee
) to '/tmp/communes.csv' CSV HEADER
