require "nokogiri"

xmlFile = File.open("config.xml")
@doc = Nokogiri::XML(xmlFile)
# xmlFile.close
version = @doc.at_xpath("//xmlns:widget/attribute::version")
major_version = version.text[0..3]
build_number = version.text.split('.').last.to_i
build_number += 1
new_version = major_version + build_number.to_s
version.content = new_version
File.open("config.xml", 'w') {|f| f.puts @doc.to_xml }